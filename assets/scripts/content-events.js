let bg = document.createElement('div');
bg.id = 'bg';
bg.classList.add('bg');
bg.style.transform = 'skewX(-23deg) translateX(' + getHiddenOffset() + 'px)';
document.body.appendChild(bg);
let content = document.createElement('div');
content.classList.add('content');

let r1 = document.createElement('div');
let el11 = document.createElement('div');
el11.classList.add('first-row-el');
let el12 = document.createElement('div');
el12.classList.add('first-row-el');
r1.appendChild(el11);
r1.appendChild(el12);
r1.classList.add('row');
content.appendChild(r1)

let r2 = document.createElement('div');
let el21 = document.createElement('div');
el21.classList.add('first-row-el');
let el22 = document.createElement('div');
el22.classList.add('first-row-el');
r2.appendChild(el21);
r2.appendChild(el22);
r2.classList.add('row');
content.appendChild(r2);
document.body.appendChild(content);


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