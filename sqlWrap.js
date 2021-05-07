'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const db = new sql.Database("apymon.db");
const traitTable = new sql.Database("traittable.db");

// check if database exists
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='ApymonData' ";

db.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createApymonTable();
  } else {
        console.log("Database file found");
  }
});

// check if database exists
let cmd2 = " SELECT name FROM sqlite_master WHERE type='table' AND name='TraitTable' ";

db.get(cmd2, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createTraitTable();
  } else {
        console.log("Database file found");
  }
});

// called to create table if needed
function createApymonTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE ApymonData (rowIdNum INTEGER PRIMARY KEY, name TEXT, material TEXT, color TEXT, multiplier FLOAT, type TEXT, image TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// --------------------------------------------------------------

function createTraitTable() {
  const cmd = 'CREATE TABLE TraitTable (rowIdNum INTEGER PRIMARY KEY, traitType TEXT, value TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// --------------------------------------------------------------

// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// allow code in index.js to use the db object
module.exports = db;
