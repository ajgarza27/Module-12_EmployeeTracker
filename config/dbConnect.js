const { Client } = require('pg');

const client = new Client({
  user: 'postgres',  
  host: 'localhost',
  database: 'employee_manager',
  password: 'password27',
});

client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = client;