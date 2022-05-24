'use strict';
let div = document.getElementsByTagName('div')[0];

let gameMenu = function() {
  let recordsTableBTN = document.createElement('button');
  div.appendChild(recordsTableBTN);
  recordsTableBTN.innerHTML = 'TOP';
  recordsTableBTN.addEventListener ('click', function() {
    window.open('./articles/top.html','_self');
  });

  let manualBTN = document.createElement('button');
  div.appendChild(manualBTN);
  
  manualBTN.innerHTML = 'Manual';
  manualBTN.addEventListener ('click', function() {
    window.open('./articles/manual.html','_self');
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
    window.open('./articles/newgame.html','_self');
  });  
  
};
document.addEventListener('DOMContentLoaded', newGameButton);
