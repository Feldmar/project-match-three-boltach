'use strict';

// import {game} from './main.js';

export let div = document.getElementById('div');
// export let per = document.createElement('div');
// div.appendChild(per);

// function gameButton() {
   
// 	let newGameBTN = document.createElement('span');
//   div.appendChild(newGameBTN);
//   newGameBTN.innerHTML = `<a href='/newgame' onclick="route()">New Game</a>`;
//   newGameBTN.addEventListener ('click', function() {
// 		let canvasTag = document.createElement('canvas');
// 		per.appendChild(canvasTag);
// 		canvasTag.setAttribute('width', '505');
// 		canvasTag.setAttribute('height', '505');
// 		canvasTag.setAttribute('id','mycanvas');
// 		game(); 
// 	// 	newGameBTN.addEventListener ('click', function() {
// 	//  while (per.firstChild) {
// 	//  	per.removeChild(per.firstChild);
// 	// 	 }
//   // 	 }); 
// 	}); 
	
// 	let recordsTableBTN = document.createElement('span');
//   div.appendChild(recordsTableBTN);
//   recordsTableBTN.innerHTML = `<a href='/top'onclick="route()">TOP</a>`;

//   let manualBTN = document.createElement('span');
//   div.appendChild(manualBTN);
//   manualBTN.innerHTML = `<a href='/manual'onclick="route()">Manual</a>`;

//   let exitBTN = document.createElement('button');
//   div.appendChild(exitBTN);
//   exitBTN.innerHTML = 'Exit Game';
//   exitBTN.addEventListener ('click', function() {
//     alert('exitBTN');
//   });
// }
// gameButton();


window.onload = function() {
  let BTN = document.createElement('ul');
  div.appendChild(BTN);
  BTN.setAttribute('id','lox');
  BTN.innerHTML = `<li><a href ="#newgame">NewGame</a></li>
  <li><a href ="#top">TOP</a></li>
  <li><a href ="#manual">Manual</a></li>`;
};