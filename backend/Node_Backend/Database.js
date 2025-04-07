
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "NewPassword",
  database: "Transaction_System",
});

module.exports = pool;
