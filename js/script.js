'use strict';
let replaceBackground = function() {
  document.body.style.backgroundImage = 'url(../svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
};
document.addEventListener('DOMContentLoaded', replaceBackground);
