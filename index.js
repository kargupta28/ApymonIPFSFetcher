'use strict';

// A static server using Node and Express
const express = require("express");
const app = express();

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

const fetch = require("node-fetch");

const checkFrom = 0;
const checkTill = 6399;
const ipfsLink = 'http://gateway.pinata.cloud/ipfs/QmSoDY8mYaQAQtQ9UGoMpHN3tHSs8d91Uqy988rWocQYKd/';
let allData = [];
let materialValues = [];
let colorValues = [];
let multiplierValues = [];
let typeValues = [];
let dataReady = false;

runIPFSFetcher();

async function runIPFSFetcher() {

  for(let i=checkFrom; i<=checkTill; i++) {
    await fetchIPFSData(i)
    .then(data => {
      allData.push(data);

      if(!materialValues.includes(data.attributes[0].value))
        materialValues.push(data.attributes[0].value);
      if(!colorValues.includes(data.attributes[1].value))
        colorValues.push(data.attributes[1].value);
      if(!multiplierValues.includes(data.attributes[2].value))
        multiplierValues.push(data.attributes[2].value);
      if(!typeValues.includes(data.attributes[3].value))
        typeValues.push(data.attributes[3].value);
    });

    console.log("Apymon Egg #", i, ", checked!");
  }

  dataReady = true;
  
  //printAllData();
  //printUniqueData('Type', 'LEGENDARY');
}

function fetchIPFSData(number) {
  return new Promise((resolve, reject) => {
    let string = ipfsLink + number;

    fetch(string)
    .then(res => res.json())
      .then(data => {
        try {
          resolve(data);
        } catch (err) {
          console.error("Error:", err);
          console.error("Data body:", data);
        }
      })
  })
}

// -------------------------------------------------

function printAllData() {
  for(let i=0; i<allData.length; i++) {
    console.log(allData[i]);
  }
}

// -------------------------------------------------

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});
