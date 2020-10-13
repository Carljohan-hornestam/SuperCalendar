// Require the better-sqlite3 SQLite driver
const sqlite3 = require('better-sqlite3');

module.exports = class DbHandler {

  constructor(pathToDb) {
    this.db = sqlite3(pathToDb);
  }

  select(sql, parameters) {
    // When using the SQLite driver
    // we create (prepared) statements
    let statement = this.db.prepare(sql);
    // here we use the statement with the method 
    // all that retrieves all data
    return parameters ? statement.all(parameters) : statement.all();
  }

  run(sql, parameters) {
    let statement = this.db.prepare(sql);
    // here we use the statement with the method 
    // run (the correct method if it does not return data)
    return parameters ? statement.run(parameters) : statement.run();
  }

}