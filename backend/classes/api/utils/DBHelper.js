// Require the better-sqlite3 SQLite driver
const sqlite3 = require('better-sqlite3');
const {PathToDb} = require('./DbPath')

let instance;

module.exports = {
  getInstance() {
    if (!instance) {
      // only the first call to getInstance will use these options to create an instance
      instance = new DBHelper();
    } 
    return instance;
  }
}

class DBHelper {
  constructor() {
    this.db = sqlite3(PathToDb);
  }

  select(sql, parameters) {
    // When using the SQLite driver
    // we create (prepared) statements
    let statement = this.db.prepare(sql);
    // here we use the statement with the method 
    // all that retrieves all data
    let result
    try {
      result = parameters ? statement.all(parameters) : statement.all();
    } catch (error) {
      result = {error: error.name}
    }
    return result;
  }

  run(sql, parameters) {
    let statement = this.db.prepare(sql);
    let result
    try {
      result = parameters ? statement.run(parameters) : statement.run();
    } catch (error) {
      result = {error: error.name}
    }
    return result;
  }
}
