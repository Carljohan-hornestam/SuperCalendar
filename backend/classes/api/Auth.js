let CurrentUserId = require('./GlobalVar')
const router = require('express').Router()


router.post("/login", (req, res) => {
  CurrentUserId.currentUserId = req.body.id;
  res.json({ success: true });
});

router.post("/logout", (req, res) => {
  CurrentUserId.currentUserId = -1;
  res.json({ success: true });
});

module.exports = router