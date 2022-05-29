'use strict';
let replaceBackground = function () {
  document.body.style.backgroundImage = 'url(../svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
};
document.addEventListener('DOMContentLoaded', replaceBackground);

// import{drinkStorage} from './main.js';
// export function showDrinksMenu() {
//   var showMenuInfo = drinkStorage.getKeys();


//   // if (showMenuInfo) {
//   //   for (var i = 0; i < showMenuInfo; i++) {
//   //     showMenuInfo += (i + 1) + '. ' + showMenuInfo[i] + '<br>';
//   //   }
//   // } 
//   document.getElementById('message').innerHTML =  showMenuInfo;
// }
// showDrinksMenu();