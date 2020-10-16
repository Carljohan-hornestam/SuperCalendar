// use the express module
// const path = require('path');
// import PathToDb from './Constants'

const express = require('express');
const RestApi = require('./RestApi');

// Our database utility helper; singleton
const DBHelper = require("./DBHelper").getInstance();

// module.exports exports something
// a class, a function etc so that it is
// reachable from other code that requires the file
module.exports = class Server {

  // The constructor runs
  // when someone writes new Server()
  constructor(port = 3000) {
    this.port = port;
    this.startServer();
    new RestApi(this.app, DBHelper);
    // new RestApi(this.app, path.join(__dirname, '../database/SuperCalendar.db'));
    this.setupRoutes();
    this.serveStaticFiles();
  }

  startServer() {
    // create a new express-based web server
    this.app = express();
    // enable the express server to read data bodies from 
    // post and put request (do this before starting the server)
    // express.json is middleware that adds this functionality
    this.app.use(express.json());
    this.app.use('/api', require('./api'))

    // start the webserver 
    this.app.listen(
      this.port,
      () => console.log('Listening on port', this.port )
    );
  }

  setupRoutes() {
    // Tell express to answer a certain thing
    // when someone goes to the url /random-number
    // this.app.get('/random-number', (request, response) => {
    //   response.json({ aRandomNumber: Math.random() });
    // });
  }

  serveStaticFiles() {
    // ask express to serve all files in the folder
    // we are now using middleware - things that extend
    // the functionality of express
    // we are using the built in middleware express.static
    // that let us serve files from a folder (www)
    this.app.use(express.static('www'));
  }
}