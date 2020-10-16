const router = require('express').Router()

router.post("/login", (req, res) => {
  this.loggedInUserId = req.body.id;
  console.log("i login ", this.loggedInUserId);
  res.json({ success: true });
});

router.post("/logout", (req, res) => {
  this.loggedInUserId = -1;
  res.json({ success: true });
});

module.exports = router