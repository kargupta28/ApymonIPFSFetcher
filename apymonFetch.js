'use strict';

// our database operations
const dbo = require('./databaseOps');


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
      // allData.push(data);
      let name = data.name;
      let material = data.attributes[0].value;
      let color = data.attributes[1].value;
      let multiplier = data.attributes[2].value;
      let type = data.attributes[3].value;
      let image = data.image;
      

      dbo.insertIntoDB(name, material, color, multiplier, type, image);


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