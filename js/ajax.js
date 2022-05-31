'use strict';
export function AJAXstorage() {
  var MyHash = {};
  var url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
  var password;
  var user = 'Match_3_B';

  $.ajax(url, {
    type: 'POST',
    cache: false,
    dataType: 'json',
    data: {
      f: 'READ',
      n: user
    },
    success: Result,
    error: errorHandler
  });

  function Result(res) {
    if (res !== ' ') {
      MyHash = JSON.parse(res.result);
      console.log('Result: ' + res.result);
    } else if (res === ' ') {
      $.ajax(url, {
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
          f: 'INSERT',
          n: user,
          v: JSON.stringify(MyHash)
        },
        success: Call,
        error: errorHandler

      });

      function Call(res) {
        console.log('Call: ' + res.result);
      }
    }
  }

  function storeInfo(MyHash) {
    password = Math.random();

    $.ajax(url, {
      type: 'POST',
      cache: false,
      dataType: 'json',
      data: {
        f: 'LOCKGET',
        n: user,
        p: password
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
          v: JSON.stringify(MyHash),
          p: password
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
    MyHash[key] = value;
    storeInfo(MyHash);

  };

  self.getKeys = function () {
    return MyHash;
  };
}