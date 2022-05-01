'use strict';
let div = document.getElementsByTagName('div')[0];

let gameMenu = function() {
  let recordsTableBTN = document.createElement('button');
  div.appendChild(recordsTableBTN);
  recordsTableBTN.innerHTML = 'TOP';
  recordsTableBTN.addEventListener ('click', function() {
    alert('recordsTableBTN');
  });

  let manualBTN = document.createElement('button');
  div.appendChild(manualBTN);
  manualBTN.innerHTML = 'Manual';
  manualBTN.addEventListener ('click', function() {
    alert('manualBTN');
  });

  let aboutBTN = document.createElement('button');
  div.appendChild(aboutBTN);
  aboutBTN.innerHTML = 'About';
  aboutBTN.addEventListener ('click', function() {
    alert('aboutBTN');
  });

  let exitBTN = document.createElement('button');
  div.appendChild(exitBTN);
  exitBTN.innerHTML = 'Exit Game';
  exitBTN.addEventListener ('click', function() {
    alert('exitBTN');
  });


};


document.addEventListener('DOMContentLoaded', gameMenu);
let newGameButton = function() {
  let newGameBTN = document.createElement('button');
  div.appendChild(newGameBTN);
  newGameBTN.innerHTML = 'New Game';
  newGameBTN.addEventListener ('click', function() {
    alert('newGameBTN');
  });  
};
document.addEventListener('DOMContentLoaded', newGameButton);