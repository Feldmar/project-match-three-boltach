'use strict';

(function () {
    function init() {
        let router = new Router([
            new Route('newgame', 'newgame.html'),            
            new Route('top', 'top.html'),
            new Route('manual', 'manual.html'),
        ]);
    }
    init();
}());