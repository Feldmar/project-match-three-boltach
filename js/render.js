'use strict';
import {Scorege} from './main.js';
let replaceBackground = function () {
  document.body.style.backgroundImage = 'url(./svg/background.svg)';
  document.body.style.margin = '0 0';
};
document.addEventListener('DOMContentLoaded', replaceBackground);

export function showResult() {
  let leaderboard = document.getElementById('leaderboard');
  if (leaderboard) {
    var hash = Scorege.getKeys();
    let resultHTML = '';
    var keys = Object.keys(hash);
    keys.forEach(key => {
      resultHTML += `<div id="toplist"> <span id="marker"> User: </span> ${key} : <span id="marker"> Score: </span> ${hash[key]}</div> <br>`;
      leaderboard.innerHTML = resultHTML;
    });
  }
}

