'use strict';

import {game} from './main.js';

export let div = document.getElementById('div');
export let per = document.createElement('div');
div.appendChild(per);

function gameButton() {
   
	let newGameBTN = document.createElement('a');
  div.appendChild(newGameBTN);
  newGameBTN.setAttribute('href','#newgame');
  newGameBTN.innerHTML = 'New Game';
  newGameBTN.addEventListener ('click', function() {
		let canvasTag = document.createElement('canvas');
		per.appendChild(canvasTag);
		canvasTag.setAttribute('width', '505');
		canvasTag.setAttribute('height', '505');
		canvasTag.setAttribute('id','mycanvas');
		game(); 
		// newGameBTN.addEventListener ('click', function() {
		// 	// while (per.firstChild) {
		// 	// 	per.removeChild(per.firstChild);
		// 	// }
  	// }); 
	}); 
	
	let recordsTableBTN = document.createElement('a');
  div.appendChild(recordsTableBTN);
  recordsTableBTN.setAttribute('href','#top');
  recordsTableBTN.innerHTML = 'TOP';

  let manualBTN = document.createElement('a');
  div.appendChild(manualBTN);
  manualBTN.setAttribute('href','#manual');
  manualBTN.innerHTML = 'Manual';

  let exitBTN = document.createElement('button');
  div.appendChild(exitBTN);
  exitBTN.innerHTML = 'Exit Game';
  exitBTN.addEventListener ('click', function() {
    alert('exitBTN');
  });
}
gameButton();

