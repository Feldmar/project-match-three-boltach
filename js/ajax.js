'use strict';
export function ZAJAXStorage() {
  var Rhash = {};
  var url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
  var updatePassword;
  var user = 'Stura';

  $.ajax(url, {
    type: 'POST',
    cache: false,
    dataType: 'json',
    data: {
      f: 'READ',
      n: user
    },
    success: rResult,
    error: errorHandler
  });

  function rResult(res) {
    if (res !== ' ') {
      Rhash = JSON.parse(res.result);
      console.log('rResult: ' + res.result);
    } else if (res === ' ') {
      $.ajax(url, {
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
          f: 'INSERT',
          n: user,
          v: JSON.stringify(Rhash)
        },
        success: callREs,
        error: errorHandler
        
      });

      function callREs(res) {
        console.log('callREs: ' + res.result);
      }
    }


    
  }

  function storeInfo(Rhash) {
    updatePassword = Math.random();

    $.ajax(url, {
      type: 'POST',
      cache: false,
      dataType: 'json',
      data: {
        f: 'LOCKGET',
        n: user,
        p: updatePassword
      },
      success: lockGetReady,
      error: errorHandler
    });

    function lockGetReady(res) {
      console.log('lockGetReady: ' + res.result);

      $.ajax(url, {
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
          f: 'UPDATE',
          n: user,
          v: JSON.stringify(Rhash),
          p: updatePassword
        },
        success: updateReady,
        error: errorHandler
      });

      function updateReady(res) {
        console.log('updateReady: ' + res.result);
      }
    }
  }

  function errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
  }

  var self = this;

  self.addValue = function (key, value) {
    Rhash[key] = value;
    storeInfo(Rhash);
    
  };

  self.getKeys = function () {
    return Rhash;
  };
}