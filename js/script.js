'use strict';
let replaceBackground = function() {
  document.body.style.backgroundImage = 'url(../svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = '100%';
};
document.addEventListener('DOMContentLoaded', replaceBackground);


