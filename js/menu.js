'use strict';
let div = document.getElementById('div');

function createBTN() {
  let BTN = document.createElement('ul');
  div.appendChild(BTN);
  BTN.innerHTML = `<li><a href ="#newgame" >NewGame</a></li>
  <li><a href ="#top">TOP</a></li>
  <li><a href ="#manual">Manual</a></li>`;
}
createBTN();