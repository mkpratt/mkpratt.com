// var bg = document.querySelectorAll(".bg")[0];
let bg = document.createElement('div');
bg.id = 'bg';
bg.classList.add('bg');
bg.style.transform = 'skewX(-23deg) translateX(' + getHiddenOffset() + 'px)';

bg.addEventListener('transitionend', onTransitionEnd(), false);
var pos = { x: getHiddenOffset() };
function toggle() {
  bg.classList.add('animating');
  bg.classList.toggle('view-content');
  let xOffset = bg.classList.contains('view-content') ? 525 : getHiddenOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
};

function onTransitionEnd() {
  bg.classList.remove('animating');
};

function getHiddenOffset() {
  return window.innerWidth + 20 + (window.innerHeight / 2 * Math.tan(getTanDeg(23)));
};

function getTanDeg(deg) {
  var rad = deg * Math.PI / 180;
  return Math.tan(rad);
};

//--------------------------------------------------------------------------------------------------
// Event Listeners
//--------------------------------------------------------------------------------------------------

window.addEventListener('resize', function () {
  let xOffset = bg.classList.contains('view-content') ? 525 : getHiddenOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
});