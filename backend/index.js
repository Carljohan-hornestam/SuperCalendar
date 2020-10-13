// Note: When we read our own modules
// (created with module.exports in files)
// we need to specify the path to the file
// - which we don't we use npm modules
const Server = require('./classes/Server');
new Server(3001);
