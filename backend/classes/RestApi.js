// Our database utility helper; singleton
const db = require("./api/utils/DBHelper").getInstance();

module.exports = class RestApi {
  constructor(app, db, routePrefix = "/api") {
    // app is supposed to be an Express web server instance
    this.app = app;
    // the routeprefix is what each url in
    // the REST api should begin with
    this.routePrefix = routePrefix;
    // get all the tables in the database
    // db = db;
    // add rest routes for each table
    this.loggedInUserId = -1;
    for (let table of this.getAllTables()) {
      if (table !== "Participants") {
        //this.setupGetRoutes(table);
        this.setupPostRoute(table);
        this.setupPutRoute(table);
        this.setupDeleteRoute(table);
        // we will write methods that setup
        // put, post and delete routes too later!
      }
    }
    // this.setupLoginRoutes();
  }

  getAllTables() {
    // This query returns a list of all tables
    // in an sqlite database
    // (when writing a comment /*sql*/
    // if you have ES6 String HTML installed
    // as a VSC extension then you will get
    // syntax highlighting of SQL-syntax)
    return db
      .select(
        /*sql*/ `
      SELECT 
          name
      FROM 
          sqlite_master 
      WHERE 
          type ='table' AND 
      name NOT LIKE 'sqlite_%';
    `
      )
      .map((x) => x.name);
  }

  setupGetRoutes(table) {
    let rp = this.routePrefix;
    // get all posts
    this.app.get(rp + "/" + table, (req, res) => {
      res.json(db.select("SELECT * FROM " + table));
    });
    // get a post by id
    this.app.get(rp + "/" + table + "/:id", (req, res) => {
      let result = db.select(
        "SELECT * FROM " + table + " WHERE id = $id",
        // req.params includes the values of params
        // (things written with : before them in the route)
        { id: req.params.id }
      );
      // if a post with the id exists return the post
      if (result.length > 0) {
        res.json(result[0]);
      }
      // else send a 404 (does not exist)
      else {
        res.status(404);
        res.json({ error: 404 });
      }
    });
  }

  setupPostRoute(table) {
    // create a post
    this.app.post(this.routePrefix + "/" + table, (req, res) => {
      res.json(
        db.run(
          /*sql*/ `
        INSERT INTO ${table} (${Object.keys(req.body)})
        VALUES (${Object.keys(req.body).map((x) => "$" + x)})
      `,
          req.body
        )
      );
    });
  }

  setupPutRoute(table) {
    // update a post
    this.app.put(this.routePrefix + "/" + table + "/:id", (req, res) => {
      res.json(
        db.run(
          /*sql*/ `
        UPDATE ${table}
        SET ${Object.keys(req.body).map((x) => x + "=$" + x)}
        WHERE id = $id 
      `,
          { ...req.body, ...req.params }
        )
      );
    });
  }

  setupDeleteRoute(table) {
    // delete a post
    this.app.delete(this.routePrefix + "/" + table + "/:id", (req, res) => {
      res.json(
        db.run(
          /*sql*/ `
        DELETE FROM ${table} WHERE id = $id
      `,
          req.params
        )
      );
    });
  }
};
