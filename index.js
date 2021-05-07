'use strict';

require('./apymonFetch')

// A static server using Node and Express
const express = require("express");
const app = express();

// our database operations
const dbo = require('./databaseOps');

// Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

// instead of older body-parser 
app.use(express.json());

// make all the files in 'public' available on the Web
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

// -------------------------------------------------

app.get("/materialValues", (request, response) => {
  response.send({
    data: materialValues
  });
});

app.get("/colorValues", (request, response) => {
  response.send({
    data: colorValues
  });
});

app.get("/multiplierValues", (request, response) => {
  response.send({
    data: multiplierValues
  });
});

app.get("/typeValues", (request, response) => {
  response.send({
    data: typeValues
  });
});

// -------------------------------------------------
app.post("/getUniqueData", (request, response, next) => {
  console.log(request.body);
  let dataToCheck = allData;

  for(let i=0; i<request.body.length; i++) {
    dataToCheck = getUniqueData(request.body[i][0], request.body[i][1], dataToCheck);
  }

  response.send({
    data: dataToCheck
  });
});


function getUniqueData(trait_type, trait_value, dataArray) {
  if(trait_value == 'Any') return dataArray;

  let uniqueData = [];
  let attributeLoc = 0;

  switch(trait_type) {
    case 'Material':
      attributeLoc = 0;
      break;
    case 'Color':
      attributeLoc = 1;
      break;
    case 'Multiplier':
      attributeLoc = 2;
      break;
    case 'Type':
      attributeLoc = 3;
  }

  for(let i=0; i<dataArray.length; i++) {
    if(dataArray[i].attributes[attributeLoc].value == trait_value) {
      uniqueData.push(dataArray[i]);
    }
  }

  return uniqueData;
}

// -------------------------------------------------



// -------------------------------------------------

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});
