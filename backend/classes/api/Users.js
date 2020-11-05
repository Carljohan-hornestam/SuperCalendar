const router = require("express").Router();
const db = require("./utils/DBHelper").getInstance();

router.get("/", (req, res) => {
  let result = db.select("SELECT * FROM Users");
  // Remove the password from the returned object
  return res.json(result.map(r => {
    delete r.password
    return r
  }))
});

router.get("/:id", (req, res) => {
  let result = db.select(
    "SELECT * FROM Users WHERE id = $id",
    // req.params includes the values of params
    // (things written with : before them in the route)
    { id: req.session.user.id }
  );
  // if a post with the id exists return the post
  if (result.length > 0) {
    // Remove the password from the returned object
    delete result[0].password
    res.json(result[0]);
  }
  // else send a 404 (does not exist)
  else {
    res.status(404);
    res.json({ error: 404 });
  }
});

router.post("/", (req, res) => {
  res.json(
    db.run(
      /*sql*/ `
    INSERT INTO Users (${Object.keys(req.body)})
    VALUES (${Object.keys(req.body).map((x) => "$" + x)})
  `,
      req.body
    )
  );
});

router.put("/:id", (req, res) => {
  if (
    !req.session.user || +req.session.user.id !== +req.params.id
  ) {
    res.json({ success: false });
  } else {
    res.json(
      db.run(
        /*sql*/ `
     UPDATE Users
     SET ${Object.keys(req.body).map((x) => x + "=$" + x)}
     WHERE id = $id`,
        { ...req.body, ...req.params }
      )
    );
  }
});

router.delete("/:id", (req, res) => {
  if (
    !req.session.user || +req.session.user.id !== +req.params.id
  ) {
    res.json({ success: false });
  } else {
    res.json(
      db.run(
        /*sql*/ `
        DELETE FROM Users
        WHERE id = $id`,
        req.params
      )
    );
  }
});

module.exports = router;
