const express = require('express');

// Middleware
var morgan = require('morgan');

// Router
var router = require('./routes.js');

const app = express();
module.exports.app = app;

// Logging and parsing
app.use(morgan('dev'));
app.use(express.json());

// Set up our routes
app.use('/qa', router);

app.get('/', (req, res) => {
  res.send('server is running');
})

const port = 3000;

app.listen(port, () => {
  console.log(`Successfully running on port ${port}`);
});


