'use strict'

// database operations.
// Async operations can always fail, so these are all wrapped in try-catch blocks
// so that they will always return something
// that the calling function can use. 

module.exports = {
  insertIntoDB: insertIntoDB
}

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

// (rowIdNum INTEGER PRIMARY KEY, name TEXT, material TEXT, color TEXT, multiplier FLOAT, type TEXT, image TEXT)

// SQL commands for ActivityTable
const insertDB = "insert into ApymonData (name, material, color, multiplier, type, image) values (?,?,?,?,?,?)"
const allDB = "select * from ApymonData";
const nameDB = "select * from ApymonData where name=?";
const materialDB = "select * from ApymonData where material=?";
const colorDB = "select * from ApymonData where color=?";
const multiplierDB = "select * from ApymonData where multiplier=?";
const typeDB = "select * from ApymonData where type=?";

// Insert into db
async function insertIntoDB(name, material, color, multiplier, type, image) {
  try {
    await db.run(insertDB, [name, material, color, multiplier, type, image]);
  } catch (error) {
    console.log("Error:", error);
  }
}