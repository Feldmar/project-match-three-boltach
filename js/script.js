'use strict';
let replaceBackground = function () {
  document.body.style.backgroundImage = 'url(./svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
  document.body.style.margin = '0';
};
document.addEventListener('DOMContentLoaded', replaceBackground);

import {Scorege} from './main.js';
export function showResult() {
  let leaderboard = document.getElementById('leaderboard');
  if (leaderboard) {
    var hash = Scorege.getKeys();
    let resultHTML = '';
    var keys = Object.keys(hash);
    keys.forEach(key => {
      resultHTML += `<span id="toplist">User: ${key} : Score: ${hash[key]}</span> <br>`;
      leaderboard.innerHTML = resultHTML;
    });
  }
}