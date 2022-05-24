'use strict';

import {game} from './main.js';

export let div = document.getElementById('div');
export  let per = document.createElement('div');
div.appendChild(per);

function gameButton() {
   
	let newGameBTN = document.createElement('button');
  div.appendChild(newGameBTN);
  newGameBTN.innerHTML = 'New Game';
  newGameBTN.addEventListener ('click', function() {
		
		let canvasTag = document.createElement('canvas');
		per.appendChild(canvasTag);

		canvasTag.setAttribute('width', '505');
		canvasTag.setAttribute('height', '505');
		canvasTag.setAttribute('id','mycanvas');
		game(); 

		newGameBTN.addEventListener ('click', function() {
			while (per.firstChild) {
				per.removeChild(per.firstChild);
				
			}
			// newGameBTN.addEventListener ('click', function() {
			// 	per.appendChild(canvasTag);
			// 	game();
			// }); 
  	}); 
	}); 
	
	let recordsTableBTN = document.createElement('button');
  div.appendChild(recordsTableBTN);
  recordsTableBTN.innerHTML = 'TOP';
  recordsTableBTN.addEventListener ('click', function() {
    
  });

  let manualBTN = document.createElement('button');
  div.appendChild(manualBTN);
  
  manualBTN.innerHTML = 'Manual';
  manualBTN.addEventListener ('click', function() {
    
  });



  let exitBTN = document.createElement('button');
  div.appendChild(exitBTN);
  exitBTN.innerHTML = 'Exit Game';
  exitBTN.addEventListener ('click', function() {
    alert('exitBTN');
  });

}
gameButton();

