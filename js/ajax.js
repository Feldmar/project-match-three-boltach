'use strict';

function TAJAXStorage() {
  var self = this;
  self.hashStorage = {};
  var AJAXphp = 'http://fe.it-academy.by/AjaxStringStorage2.php';
  var password;

  $.ajax({
    url: AJAXphp,
    type: 'POST',
    cache: false,
    data: {
      f: 'READ',
      n: 'DRINK'
    },
    success: LoadData,
    error: Error
  });

  function LoadData(data) {
    if (data !== '') {
      self.hashStorage = JSON.parse(data.result);
    } else if (data === '') {
      $.ajax({
        url: AJAXphp,
        type: 'POST',
        cache: false,
        data: {
          f: 'INSERT',
          n: 'DRINK',
          v: JSON.stringify(self.hashStorage)
        },
        success: PasteData,
        error: Error
      });
    }
  }
  function PasteData(data) {
    console.log(data.result);
  }

  self.addValue = function (key, value) {
    self.hashStorage[key] = value;
    addValue(self.hashStorage);
  };

  self.getValue = function (key) {
    if (key in self.hashStorage) {
      return self.hashStorage[key];
    }
  };

  self.deleteValue = function (key) {
    if (key in self.hashStorage) {
      delete self.hashStorage[key];
      addValue(self.hashStorage);
    }
  };

  self.getKeys = function () {
    return (Object.keys(self.hashStorage));
  };

  function addValue(hashStorage) {
    password = Math.random();

    $.ajax({
      url: AJAXphp,
      type: 'POST',
      data: {
        f: 'LOCKGET',
        n: 'DRINK',
        p: password
      },
      cache: false,
      success: Blocking,
      error: Error
    });

    function Blocking(data) {
      if (data.error !== undefined) {
        console.log(data.error);
      }
    }

    $.ajax({
      url: AJAXphp,
      type: 'POST',
      data: {
        f: 'UPDATE',
        n: 'DRINK',
        v: JSON.stringify(hashStorage),
        p: password
      },
      cache: false,
      success: DataUpdate,
      error: Error
    });
  }

  function DataUpdate(data) {
    if (data.error !== undefined){
      console.log(data.error);
    }
  }

  function Error(jqXHR, StatusStr, ErrorStr) {
    console.log(StatusStr + ' ' + ErrorStr);
  }
}