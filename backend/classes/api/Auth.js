const db = require("./utils/DBHelper").getInstance();
const router = require('express').Router()

router.post("/login", (req, res) => {
  if (req.session.user) {
    return res.json({ error: 'Already logged in!' });
  }

  let result = db.select(/*sql*/`
        SELECT *
        FROM Users
        WHERE email = $email AND password = $password`, req.body
      );

  // We did not find any matching email + password
  if (result.length === 0) {
    return res.json({ error: "No match!" });
  }

  // Log in by adding user to the session
  req.session.user = result[0];
  delete req.session.user.password
  res.json(req.session.user);
});

router.post("/logout", (req, res) => {
  if (!req.session.user) {
    // No user is logged assert.notInstanceOf(object, constructor, "[message]");
    return res.json({ error: "Already logged out!" });
  }

  // Log out the user by deleting the session.user property
  delete req.session.user;
  res.json({ success: "Logged out!" });
});

router.get('/whoami', (req, res) => {
  res.json(req.session.user || { error: 'No user logged in!' });
});

module.exports = router