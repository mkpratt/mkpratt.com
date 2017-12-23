'use strict';

(function() {
  var segments = document.querySelector('#main').children;
  var arr = [];
  for (let i = 0; i < segments.length; i++) {
    arr.push(i);
  }
  shuffle(arr);
  delayLoop(segments.length);

  function shuffle(a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }

  function delayLoop(to, at) {
    var at = at || 0;
    if (at < to) {
      setTimeout(function() {
        var el = segments[arr[at]];
        el.classList.add('on');
        delayLoop(to, at + 1);
      }, (100 - at * 15) * at);
    }
  }
})();