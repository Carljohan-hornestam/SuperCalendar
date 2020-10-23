const router = require("express").Router();
const db = require("./utils/DBHelper").getInstance();

router.get("/", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false });
  } else {
    let str = /* sql */ `SELECT * FROM Events 
    WHERE (creatorId = ${req.session.user.id} OR ownerId = ${req.session.user.id})` 
    console.log('i get events, str: ', str);
    res.json(
      db.select(str)
      );
  }
});

router.post("/", (req, res) => {
 if (!req.session.user) {
    res.status(403)
    res.json({ success: false })
    return
  }

  req.body.creatorId = req.session.user.id
  req.body.ownerId = req.session.user.id
  
  let result = db.run(/*sql*/ `
  INSERT INTO Events (${Object.keys(req.body)}) 
  VALUES (${Object.keys(req.body).map(x => "$" + x)})
  `, req.body)
  res.json(result)
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
  mainEvent.participants = event.map(x => {
    if (+x.parentId === +req.params.id) {
      return ({ "userName": x.userName, "email": x.email})
    }
  })

  let invited = db.select(/*sql*/`SELECT * FROM invitedWUserInfo WHERE eventId = ${req.params.id}`, req.params)
  mainEvent.invited = invited
  
  res.json(mainEvent)
})

router.put("/:id", (req, res) => {
  if (!req.session.user) {
    res.status(403)
    res.json({ success: false})
    return
  }
  let result = db.run(/* sql */ `UPDATE Events SET ${Object.keys(req.body).map((x) => x + "=$" + x)}
  WHERE id = $id AND creatorId = ${req.session.user.id}`, {...req.body, ...req.params})
  if (result.changes === 0) {
    res.status(403)
    res.json({ success: false})
    return
  }
  res.json(result)
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
  console.log(req.params.startDateTime);
  let result = db.select(/* sql */ `SELECT * FROM Events 
  WHERE startDateTime LIKE '${date}' AND  ownerId = ${req.session.user.id}`, req.params)
  res.json(result)
})

router.get("/invitations", (req, res) => {
  if (!req.session.user) {
    res.json({ success: false });
  } else {
    res.json(
      db.select(/* sql */`
        SELECT * FROM PendingInvitations WHERE invitedUserId = ${req.session.user.id}`
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
  req.body.invitations.map( p => {
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
  console.log(req.session.user.id);
  let creatorCheck = db.select(/*sql*/`SELECT * FROM Events WHERE id = $eventId AND creatorId = ${req.session.user.id} `, req.params)
  console.log(creatorCheck);
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

module.exports = router;
