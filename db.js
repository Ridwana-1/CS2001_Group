
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',     
  database: 'product_db'  
});

connection.connect(err => {
    if (err) {
      console.error('MySQL connection error:', err.stack);
      process.exit(1);
    }
    console.log('Connected to MySQL');
  });
  
  module.exports = connection;