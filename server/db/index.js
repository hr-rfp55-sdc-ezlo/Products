const { Pool } = require('pg');

const connection = new Pool({
  user: 'huongnguyen',
  host: 'ec2-13-52-252-73.us-west-1.compute.amazonaws.com',
  database: 'sdcdb',
  password: 'sdc',
  port: 5432,
});

connection.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Error connecting to db: ', err);
  } else {
    console.log('Connected to db!');
  }
});

module.exports = connection;
