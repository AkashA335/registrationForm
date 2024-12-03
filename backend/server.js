const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log("Connected to database");
  }
});

app.post('/register', (req, res) => {
  const sql = "INSERT INTO employee (name, employeeID, email, phoneNumber, department, dateOfJoining, role) VALUES (?)";
  const values = [
    req.body.name,
    req.body.employeeID,
    req.body.email,
    req.body.phoneNumber,
    req.body.department,
    req.body.dateOfJoining,
    req.body.role
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        if (err.sqlMessage.includes("email")) {
          return res.status(409).json({ message: "Email already exists" });
        }
        if (err.sqlMessage.includes("employeeID")) {
          return res.status(409).json({ message: "Employee ID already exists" });
        }
      }
      return res.status(500).json(err);
    }
    return res.status(201).json({ message: "Employee registered successfully", data });
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 8080");
});
