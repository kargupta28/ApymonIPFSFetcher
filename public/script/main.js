'use strict';

let materialDropdown = document.getElementById("materialDropdown");
let colorDropdown = document.getElementById("colorDropdown");
let multiplierDropdown = document.getElementById("multiplierDropdown");
let typeDropdown = document.getElementById("typeDropdown");
let eggSelect = document.getElementById("eggSelect");
let eggList = document.getElementById("eggList");
let submitButton = document.getElementById("submitButton");
let materialText = document.getElementById("materialText");
let colorText = document.getElementById("colorText");
let multiplierText = document.getElementById("multiplierText");
let typeText = document.getElementById("typeText");
let activeEggList = [];

submitButton.addEventListener("click", submitForm);
eggSelect.addEventListener("change", eggSelectChanged);

onCreate();

async function onCreate() {
  await fetchDropdown("/materialValues", materialDropdown);
  await fetchDropdown("/colorValues", colorDropdown);
  await fetchDropdown("/multiplierValues", multiplierDropdown);
  await fetchDropdown("/typeValues", typeDropdown);
}

function fetchDropdown(url, element) {  
  fetch(url)
  .then(res => res.json())
      .then(data => {
        data.data.sort();
        data.data.sort((a,b) => a-b);
        fillDropdown(element, data.data, 'Any');
      });
}

function fillDropdown(element, data, defaultVal) {
  let option;

  data.unshift(defaultVal);

  for(let i=0; i<data.length; i++) {
    option = document.createElement('option');
    option.value = data[i];
    option.text = data[i];
    element.appendChild(option);
  }
}

function submitForm() {
  fillTextarea();
}

function fillTextarea() {
  let dataToSubmit = [];
  activeEggList = [];
  removeAllChildNodes(eggSelect);

  dataToSubmit.push(['Material', materialDropdown.value]);
  dataToSubmit.push(['Color', colorDropdown.value]);
  dataToSubmit.push(['Multiplier', multiplierDropdown.value]);
  dataToSubmit.push(['Type', typeDropdown.value]);
  

  fetch("/getUniqueData", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSubmit), // post body
  })
  .then(res => res.json())
      .then(data => {
        console.log(data.data);
        let eggNames = [];

        for(let i=0; i<data.data.length; i++) {
          activeEggList.push(data.data[i]);
          eggNames.push(data.data[i].name);
        }
        fillDropdown(eggSelect, eggNames, 'None');
        eggList.textContent = JSON.stringify(eggNames.slice(1));
      });
}

function eggSelectChanged() {
  let selectedValue = eggSelect.value;
  let index;

  if(selectedValue == 'None') {
    materialText.value = '';
    colorText.value = '';
    multiplierText.value = '';
    typeText.value = '';
  }

  for(index=0; index<activeEggList.length; index++) {
    if(activeEggList[index].name == selectedValue)
      break;
  }

  console.log("Display data:", activeEggList[index]);

  materialText.value = activeEggList[index].attributes[0].value;
  colorText.value = activeEggList[index].attributes[1].value;
  multiplierText.value = activeEggList[index].attributes[2].value;
  typeText.value = activeEggList[index].attributes[3].value;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
