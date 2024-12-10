const mysql = require("mysql");
const pool = mysql.createPool({
  host: "localhost",
  user: "baea2f9e",
  password: "Cab#22se",
  database: "baea2f9e",
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  console.log("Connected to MySQL");
  connection.release();
});

module.exports = pool;
