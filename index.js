'use strict';

// A static server using Node and Express
const express = require("express");
const app = express();
const fs = require('fs');

// instead of older body-parser 
app.use(express.json());

// make all the files in 'public' available on the Web
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

// -------------------------------------------------

const fetch = require("node-fetch");

const url = 'https://galaxy.staratlas.com/nfts';
const tokenMints = [
    {'name': 'POLIS',
     'address': 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk'},
    {'name': 'ATLAS',
     'address': 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx'},
    {'name': 'USDC',
     'address': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'},
    {'name': 'PILOT',
     'address': 'BswdGxfurGpSKPPhHUP6d9uzdY3bAG8o3CJnFUQLanzw'},
    {'name': 'CAPN',
     'address': 'HzeBiGCyGESHS3d5ndQmvz7q7Nz8Py6PV5xFjRL4cQGk'},
    {'name': 'PASS',
     'address': '9iHQcYQR3qfqUh1HsTvRu2K1QZSCW3M6DXCY7HcwFGJn'}
];
const markets = [];

fetchNFTs();

async function fetchNFTs() {
  await fetch(url)
    .then(res => res.json())
      .then(data => {
        for(var i=0; i<data.length; i++) {
          var symbolName = data[i].symbol;
          var symbolAddress = data[i].mint;

          if(symbolName == 'FM-T3A') {
            if(data[i]._id == '6143e0ac92761eeee4bc18f8')
              symbolName = 'FM-T3ANI'
            else
              symbolName = 'FM-T3ATLAS'

          }

          tokenMints.push({
            name: symbolName,
            address: symbolAddress
          });
        }
      });

  console.log(tokenMints);

  var tokenMintsJson = JSON.stringify(tokenMints, null, 4)

  fs.writeFile('token-mints.json', tokenMintsJson, 'utf8', (err)=>{
            if(err){
                console.log(err)
            }
        })
}



// -------------------------------------------------

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});
