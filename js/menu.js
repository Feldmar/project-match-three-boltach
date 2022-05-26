'use strict';
let div = document.getElementById('div');
// import {game} from './main.js';
window.onload = function() {
  
  let BTN = document.createElement('ul');
  div.appendChild(BTN);
  
  BTN.innerHTML = `<li><a href ="#newgame" >NewGame</a></li>
  <li><a href ="#top">TOP</a></li>
  <li><a href ="#manual">Manual</a></li>`;

  let newBtn = document.querySelector('#new');



  
};