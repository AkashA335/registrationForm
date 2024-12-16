const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST  || 'db',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log("Connected to database");
  }
});

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO employee (name, employeeID, email, phoneNumber, department, dateOfJoining, role) VALUES (?)";
  const values = [
    req.body.name,
    req.body.employeeID,
    req.body.email,
    req.body.phoneNumber,
    req.body.department,
    req.body.dateOfJoining,
    req.body.role,
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        if (err.sqlMessage.includes("email")) {
          return res.status(409).json({ message: "Email already exists" });
        }
        if (err.sqlMessage.includes("employeeID")) {
          return res
            .status(409)
            .json({ message: "Employee ID already exists" });
        }
      }
      return res.status(500).json(err);
    }
    return res
      .status(201)
      .json({ message: "Employee registered successfully", data });
  });
});

app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
});

app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, department, dateOfJoining, role } = req.body;
  const formattedDate = new Date(dateOfJoining).toISOString().split("T")[0];
  const sql =
    "UPDATE employee SET name = ?, email = ?, phoneNumber = ?, department = ?, dateOfJoining = ?, role = ? WHERE employeeID = ?";
  const values = [name, email, phoneNumber, department, formattedDate, role, id];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update Error: ", err);
      return res.status(500).json({ message: "Error updating employee" });
    }
    return res.status(200).json({ message: "Employee updated successfully" });
  });
});

app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM employee WHERE employeeID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting employee" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({ message: "Employee deleted successfully" });
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
