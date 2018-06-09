const mongoose = require('mongoose');
const config = require('config');

// Connect to our Database and handle any bad connections
mongoose.connect(config.get('db.mongoUrl'));
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

// Import all of our models
require('./models/question');
require('./models/quiz');
require('./models/response');
require('./models/user');

// Start our app
const app = require('./app');
app.set('port', config.get('ports.server') || 3001);
const server = app.listen(app.get('port'), () => {
  console.log(`Server running → http://localhost:${server.address().port}`);
});

module.exports = server;