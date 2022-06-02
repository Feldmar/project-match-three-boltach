'use strict';
import {Router} from './router.js';
(function () {
  function initialization() {
    let router = new Router([
      new Route('newgame', 'newgame.html'),
      new Route('top', 'top.html'),
      new Route('manual', 'manual.html', true),
    ]);
  }
  initialization();
}());