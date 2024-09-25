// db.js

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const port = 8081;

const db = mysql.createConnection({
  host: "localhost",
  user: "ignite",
  password: "password",
  database: "testingdb",
});

// Open the MySQL connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("DB.JS -- Connected to MySQL");
});

module.exports = db;
