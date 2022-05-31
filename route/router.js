'use strict';
import {game} from '../js/main.js';

import {showResult} from '../js/script.js';
export function Router(routes) {
  try {
    if (!routes) {
      throw 'error: routes param is mandatory';
    }
    this.constructor(routes);
    this.initialization();
  } catch (e) {
    console.error(e);
  }
}

Router.prototype = {
  routes: undefined,
  rootElem: undefined,
  constructor: function (routes) {
    this.routes = routes;
    this.rootElem = document.getElementById('piz');
  },
  initialization: function () {
    let r = this.routes;
    (function (scope, r) {
      window.addEventListener('hashchange', function (e) {
        scope.hasChanged(scope, r);
      });
    })(this, r);
    this.hasChanged(this, r);
  },
  hasChanged: function (scope, r) {
    if (window.location.hash.length > 0) {
      for (let i = 0, length = r.length; i < length; i++) {
        let route = r[i];
        if (route.isActiveRoute(window.location.hash.substr(1))) {
          scope.goToRoute(route.htmlName);
        }
      }
    } else {
      for (let i = 0, length = r.length; i < length; i++) {
        let route = r[i];
        if (route.default) {
          scope.goToRoute(route.htmlName);
        }
      }
    }
  },
  goToRoute: function (htmlName) {
    (function (scope) {
      let url = './views/' + htmlName,
        xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          scope.rootElem.innerHTML = this.responseText;
        }
        showResult();
        game();
        
      };
      xhttp.open('GET', url, true);
      xhttp.send();
    })(this);
  }
};