let CurrentUserId = require("./GlobalVar");
const router = require("express").Router();
const db = require("./../DBHelper").getInstance();

router.get("/", (req, res) => {
  if (CurrentUserId.currentUserId === -1) {
    res.json({ success: false });
  } else {
    let str = /* sql */ `SELECT * FROM Events 
    WHERE (creatorId = ${CurrentUserId.currentUserId} OR ownerId = ${CurrentUserId.currentUserId})` 
    console.log('i get events, str: ', str);
    res.json(
      db.select(str)
      );
  }
});

router.get("/invitations/get", (req, res) => {
  console.log("currentuserId: ", CurrentUserId.currentUserId);
  if (CurrentUserId.currentUserId === -1) {
    res.json({ success: false });
  } else {
    res.json(
      db.select(
        /* sql */ `SELECT * FROM PendingInvitations WHERE invitedUserId = ${CurrentUserId.currentUserId}`
      )
    );
  }
});

router.post("/invitations/reply", (req, res) => {
  console.log(req, "PARAMETRAR");
  const { userId, pendingInvitationId, accept } = req.body;
  console.log("loggedInUserId: ", this.loggedInUserId);
  console.log("userId: ", userId);
  if (this.loggedInUserId === -1 || this.loggedInUserId !== userId) {
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
      event.owner = this.loggedInUserId;
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
