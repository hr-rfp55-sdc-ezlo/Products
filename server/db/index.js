const { Pool, Client } = require('pg')

const connection = new Pool();

module.exports = connection;