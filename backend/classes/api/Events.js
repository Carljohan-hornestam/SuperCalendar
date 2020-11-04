const moment = require("moment");
const { NULL } = require("node-sass");
const router = require("express").Router();
const db = require("./utils/DBHelper").getInstance();

router.get("/", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false });
  } else {
    let str = /* sql */ `SELECT * FROM Events 
    WHERE (creatorId = ${req.session.user.id} OR ownerId = ${req.session.user.id})` 
    res.json(
      db.select(str)
      );
  }
});

function getLoopCounter(recurringEvent, startDateTimeIn, recurringInterval, recurringIntervalEndIn) {
  let startDateTime = new Date(startDateTimeIn)
  let recurringIntervalEnd = new Date(recurringIntervalEndIn)
  if (recurringEvent == 1 && recurringInterval > 0) {  
    let milliseconds = recurringIntervalEnd.getTime() - startDateTime.getTime()

    switch(recurringInterval) {
      case 1:
        return Math.round(milliseconds / (1000 * 3600 * 24))
        break

      case 2:
        return Math.round(milliseconds / (1000 * 3600 * 24 * 7))
        break

      case 3:
        let timeBetween = (recurringIntervalEnd.getFullYear() - startDateTime.getFullYear()) * 12
        timeBetween -= startDateTime.getMonth();
        timeBetween += recurringIntervalEnd.getMonth();
        return timeBetween
        break
      
      case 4:
        let yearMilli = milliseconds / (1000 * 3600 * 24) + 1
        return Math.abs(Math.floor(yearMilli / 365.25))
        break

      default:
        console.log("OH NO!");
        break;
    }
  }
  return 0
}

router.post("/", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false })
    return
  }
  let invitations = req.body.participants
  let recurringEvent = req.body.recurringEvent || 0
  let recurringInterval = req.body.recurringInterval
  let recurringIntervalEnd = new Date(req.body.intervalEnd)
  delete req.body.intervalEnd
  let timeBetween = getLoopCounter(recurringEvent, req.body.startDateTime, recurringInterval, recurringIntervalEnd)
  req.body.creatorId = req.session.user.id
  req.body.ownerId = req.session.user.id
  delete req.body.participants
  let results = []
  let i = 0
  let originalStartDate = req.body.startDateTime
  let originalEndDate = req.body.endDateTime
  let recurringParentId = 0

  do {
    if(recurringEvent && recurringParentId !== 0) {
      req.body.recurringParentId = recurringParentId
    } else {
      req.body.recurringParentId = null
    }
    let result = db.run(/*sql*/ `
      INSERT INTO Events (${Object.keys(req.body)}) 
      VALUES (${Object.keys(req.body).map(x => "$" + x)})
      `, req.body)

    let newStartDate
    let newEndDate

    switch (recurringInterval) {
      case 1:
        newStartDate = moment(originalStartDate, "YYYY-MM-DD, HH:mm").add(i + 1, "d")
        newEndDate = moment(originalEndDate, "YYYY-MM-DD, HH:mm").add(i + 1, "d")
        break;

      case 2:
        newStartDate = moment(originalStartDate, "YYYY-MM-DD, HH:mm").add(i + 1, "w")
        newEndDate = moment(originalEndDate, "YYYY-MM-DD, HH:mm").add(i + 1, "w")
        break;

      case 3:
        newStartDate = moment(originalStartDate, "YYYY-MM-DD, HH:mm").add(i + 1, "M")
        newEndDate = moment(originalEndDate, "YYYY-MM-DD, HH:mm").add(i + 1, "M")
        break;

      case 4:
        newStartDate = moment(originalStartDate, "YYYY-MM-DD, HH:mm").add(i + 1, "y")
        newEndDate = moment(originalEndDate, "YYYY-MM-DD, HH:mm").add(i + 1, "y")
        break;

      default:
        console.log("OH NO!");
        break;
    }
    if (recurringInterval > 0) {
      req.body.startDateTime = newStartDate.format('YYYY-MM-DD, HH:mm')
      req.body.endDateTime = newEndDate.format('YYYY-MM-DD, HH:mm')
    }
    
    let eventId = result.lastInsertRowid
    if(recurringEvent && recurringParentId === 0) {
      recurringParentId = eventId
    }

    results.push(result)
    invitations.forEach( p => {
      let result = db.run(
      /* sql */ `INSERT INTO PendingInvitations (eventId, invitedUserId) 
      VALUES (${eventId}, ${p.userId})`, {...p}
      )
      if (result.error) {
        results.push({"error": "User could not be / is already invited!"})
      } else {
        results.push(result)
      }
    })
    i++
  } while (i <= timeBetween)
  res.json(results)
})

router.get("/:id", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false })
    return
  }
  let event = db.select(/* sql */ `SELECT * FROM eventWParticipants 
    WHERE eventId = ${req.params.id} OR parentId = ${req.params.id}`
  )
  //Check if user is a participant or creator, if NOT return
  let checkUser = event.find(e => +e.ownerId === +req.session.user.id || +e.creatorId === +req.session.user.id)
  if (checkUser === undefined) {
    res.status(403)
    res.json({ success: false })
    return
  }
  
  let mainEvent = event.find(x => +x.eventId === +req.params.id)
  mainEvent.participants = []
  event.forEach(x => {
    if (+x.parentId === +req.params.id) {
      mainEvent.participants.push({ "userId": x.userId, "userName": x.userName, "email": x.email })
    }
  })
  
  delete mainEvent.userId
  
  let invited = db.select(/*sql*/`SELECT * FROM invitedWUserInfo WHERE eventId = ${req.params.id}`, req.params)
  mainEvent.invited = invited
  
  res.json(mainEvent)
})

router.put("/:id", (req, res) => {
  let cascadeChange = req.body.cascadeChange || false
  delete req.body.cascadeChange
  delete req.body.intervalEnd
  let str = ""

  if (!req.session.user) {
    res.status(403)
    res.json({ success: false})
    return
  }
  let results = []
  let result = {}
  
  // Get current invitations and participants from the database.
  let invitations = db.select(/*sql*/`SELECT * FROM PendingInvitations WHERE eventId = $id`, req.params)
  let participants = db.select(/*sql*/`SELECT * FROM Events WHERE parentId = $id`, req.params)
  
  // Compare if there's an invitation in the db that matches the userId in the participants list sent from frontend
  // If found in both lists, remove from both lists
  if(req.body.participants !== undefined) {
    invitations.forEach(i => req.body.participants.forEach(u => {
      if (i.invitedUserId === u.userId) {
        req.body.participants.pop(u)
        invitations.pop(i)
      }
    }))
    
    // Compare if there's a participant in the db that matches the userId in the participants list sent from frontend
    // If found in both lists, remove from both lists
    participants.forEach(p => req.body.participants.forEach(i => {
      if (p.ownerId === i.userId) {
        req.body.participants.pop(i)
        participants.pop(p)
      }
    }))
    
    // Deletes any remaining invitations from the database because they are no longer invited
    invitations.forEach(inv => {
      result = db.run(/*sql*/`DELETE FROM PendingInvitations WHERE eventId = $id AND invitedUserId = ${inv.invitedUserId}`, req.params)
      results.push(result)
    })
  
    // Deletes any remaining participants from the database because they are no longer welcome!
    participants.forEach(part => {
      result = db.run(/*sql*/`DELETE FROM Events WHERE parentId = $id AND ownerId = ${part.ownerId}`, req.params)
      results.push(result)
    })
  
    // If there are any users left in the participants list from the frontend, send them invitations
    req.body.participants.forEach(invite => {
      result = db.run(/* sql */ `INSERT INTO PendingInvitations (eventId, invitedUserId) 
        VALUES ($id, ${invite.userId})`, req.params
      )
      results.push(result)
    })
    // Removes participants list from req.body so as to not confuse the database when doing an update.
    delete req.body.participants
    req.body.startDateTime = req.body.startDateTime.slice(0, 17)
    req.body.endDateTime = req.body.endDateTime.slice(0,17)
  }
  const event = db.select(/* sql */ `SELECT * FROM Events WHERE id = $id`, req.params)
  if (cascadeChange) {
    if (event[0].recurringParentId === null) {
      str = `UPDATE Events SET ${Object.keys(req.body).map((x) => x + "=$" + x)}
  WHERE (id = $id OR parentId = $id OR recurringParentId = $id) AND creatorId = ${req.session.user.id}`
    } else {
      str = `UPDATE Events SET ${Object.keys(req.body).map((x) => x + "=$" + x)}
  WHERE (id = $id OR parentId = $id OR (recurringParentId = ${event[0].recurringParentId} AND startDateTime >= '${event[0].startDateTime}')) AND creatorId = ${req.session.user.id}`
    } 
  } else {
    str = `UPDATE Events SET ${Object.keys(req.body).map((x) => x + "=$" + x)}
  WHERE (id = $id OR parentId = $id ) AND creatorId = ${req.session.user.id}`
  }

  result = db.run(str, {...req.body, ...req.params})
  if (result.changes === 0) {
    res.status(403)
    res.json({ success: false})
    return
  }
  results.push(result)
  res.json(results)
})

router.delete("/:id", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false})
    return
  }
  let result = db.run(/* sql */ `DELETE FROM Events WHERE id = $id AND ownerId = ${req.session.user.id}`, req.params)
  if (result.changes === 0) {
    res.status(403)
    res.json({ success: false})
    return
  }
  res.json(result)
})

router.get("/date/:startDateTime", (req, res) => {
  if (!req.session.user || req.params.startDateTime.length > 10) {
    res.status(403)
    res.json({ success: false})
    return
  }
  let date = req.params.startDateTime + "%"
  
  let result = db.select(/* sql */ `SELECT * FROM Events 
  WHERE startDateTime LIKE '${date}' AND  ownerId = ${req.session.user.id}
  ORDER BY startDateTime`, req.params)
  res.json(result)
})

router.get("/invitations/get", (req, res) => {
  if (!req.session.user) {
    res.json({ success: false });
  } else {
    res.json(
      db.select(/* sql */`
        SELECT * FROM vwInvitations WHERE invitedUserId = ${req.session.user.id}`
      )
    );
  }
});

router.post("/invitations", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false})
    return
  }

  // Checks if the logged in user is the creator of the event when trying to invite
  let creatorCheck = db.select(/*sql*/`SELECT * FROM Events WHERE id = $eventId AND creatorId = ${req.session.user.id} `, req.body)
  
  if (creatorCheck.length === 0) {
    res.status(403)
    res.json({ success: false})
    return
  }
  let results = []
  req.body.invitations.forEach(p => {
    let result = db.run(
    /* sql */ `INSERT INTO PendingInvitations (eventId, invitedUserId) 
    VALUES (${req.body.eventId}, ${p.id})`, {...req.body, ...p}
    )
    if (result.error) {
      results.push({"error": "User could not be / is already invited!"})
    } else {
      results.push(result)
    }
  })
  res.json(results)
})

router.delete("/invitations/:eventId/:invitationId", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false})
    return
  }
 
  let creatorCheck = db.select(/*sql*/`SELECT * FROM Events WHERE id = $eventId AND creatorId = ${req.session.user.id} `, req.params)

  if (creatorCheck.length === 0) {
    res.status(403)
    res.json({ success: false})
    return
  }
  let result
  if (req.params.invitationId === "all") {
    result = db.run(/*sql */`DELETE FROM PendingInvitations WHERE eventId = $eventId`, req.params);
  } else {
    result = db.run(/*sql */`DELETE FROM PendingInvitations WHERE eventId = $eventId AND id = $invitationId`, req.params);
  }
  
  res.json(result)
})

router.post("/invitations/reply", (req, res) => {
  const { userId, pendingInvitationId, accept } = req.body;
  if (!req.session.user || req.session.user.id !== userId) {
    res.json({ success: false });
  } else {
    if (accept) {
      let invite = db.select(
        `SELECT * FROM PendingInvitations WHERE id = ${pendingInvitationId}`
      )[0];
      if (invite === undefined) {
        res.status(404);
        res.json({ error: 404 });
      }
      let event = db.select(
        `SELECT * FROM Events WHERE id = ${invite.eventId}`
      )[0];
      event.ownerId = req.session.user.id;
      event.parentId = event.id
      event.id = undefined;
      db.run(
        /*sql*/ `
              INSERT INTO Events (${Object.keys(event)})
              VALUES (${Object.keys(event).map((x) => "$" + x)})
            `,
        event
      );
    }
    // ta bort pendinginvitation
    db.run(`DELETE FROM PendingInvitations WHERE id = ${pendingInvitationId}`);
    res.json({ success: true });
  }
});

router.get("/search/:search", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false });
    return
  }
  let search =  "%" + req.params.search + "%"
    let result = db.select(/* sql */ `SELECT * FROM Events 
      WHERE (creatorId = ${req.session.user.id} OR ownerId = ${req.session.user.id}) AND title LIKE '${search}'`)
    res.json(result)
})

module.exports = router;
