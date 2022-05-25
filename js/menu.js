'use strict';

import {game} from './main.js';

export let div = document.getElementById('div');
export let piz = document.querySelector('#piz');


window.onload = function() {
  let BTN = document.createElement('ul');
  div.appendChild(BTN);
  BTN.setAttribute('id','lox');
  BTN.innerHTML = `<li><a href ="#newgame" id="newgame">NewGame</a></li>
  <li><a href ="#top">TOP</a></li>
  <li><a href ="#manual">Manual</a></li>`;
  let newGameBTN = document.querySelector('#newgame');
  newGameBTN.addEventListener ('click', function() {
  	let canvasTag = document.createElement('canvas');
  	piz.appendChild(canvasTag);
  	canvasTag.setAttribute('width', '505');
  	canvasTag.setAttribute('height', '505');
  	canvasTag.setAttribute('id','mycanvas');
  	game(); 
  
});
};