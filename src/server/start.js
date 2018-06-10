const mongoose = require('mongoose');

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Tell mongoose to use ES6 promises
mongoose.Promise = global.Promise;

// Connect to our Database and handle any bad connections
mongoose
  .connect(process.env.NODE_ENV === 'test' ? process.env.MONGO_URL_TEST : process.env.MONGO_URL, {
    keepAlive: 5000
  })
  .catch(err => console.error(err.message));

// Import all of our models
require('./models/question');
require('./models/quiz');
require('./models/response');
require('./models/user');

// Start our app
const app = require('./app');
app.set('port', process.env.SERVER_PORT || 3001);
const server = app.listen(app.get('port'), () => {
  console.log(`Server running → http://localhost:${server.address().port}`);
});

module.exports = server;