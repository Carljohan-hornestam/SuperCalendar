const router = require("express").Router();
const db = require("./utils/DBHelper").getInstance();

router.get("/", (req, res) => {
  if (!req.session.user) {
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

router.get("/invitations", (req, res) => {
  if (!req.session.user) {
    res.json({ success: false });
  } else {
    res.json(
      db.select(
        /* sql */ `SELECT * FROM PendingInvitations WHERE invitedUserId = ${req.session.user.id}`
      )
    );
  }
});

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
