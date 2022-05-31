'use strict';
let replaceBackground = function () {
  document.body.style.backgroundImage = 'url(../svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
};
document.addEventListener('DOMContentLoaded', replaceBackground);


import {scoresStorage} from './main.js';
export function showResult() {
  let leaderboard = document.getElementById('leaderboard');
if (leaderboard) {
  var hash = scoresStorage.getKeys();
  let resultHTML = '';
  var keys = Object.keys(hash);
  keys.forEach(key => {
     resultHTML += `<span id="toplist">User: ${key} : Score: ${hash[key]}</span> <br>`;
    
     leaderboard.innerHTML = resultHTML;
  });
}  
}
