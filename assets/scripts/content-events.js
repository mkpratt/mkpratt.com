let bg = document.createElement('div');
bg.id = 'bg';
bg.classList.add('bg');
bg.style.transform = 'skewX(-23deg) translateX(' + getHiddenOffset() + 'px)';
bg.addEventListener('transitionend', function onTransitionEnd() {
  bg.classList.remove('animating');
});
document.body.appendChild(bg);

let cw = document.createElement('div');
cw.id = 'content-wrapper';
cw.style.height = (window.innerHeight * .8) + 'px';
cw.style.width = (window.innerWidth - 540) + 'px';
cw.style.margin = (window.innerHeight * .1) + 'px 0';
cw.style.transform = 'translateX(540px)';
cw.style.position = 'absolute';
cw.style.zIndex = '2000';
document.body.appendChild(cw);

// let content = document.createElement('div');
// content.classList.add('content');

// let r1 = document.createElement('div');
// let el11 = document.createElement('div');
// el11.classList.add('first-row-el');
// let el12 = document.createElement('div');
// el12.classList.add('first-row-el');
// r1.appendChild(el11);
// r1.appendChild(el12);
// r1.classList.add('row');
// content.appendChild(r1)

// let r2 = document.createElement('div');
// let el21 = document.createElement('div');
// el21.classList.add('second-row-el');
// let el22 = document.createElement('div');
// el22.classList.add('second-row-el');
// r2.appendChild(el21);
// r2.appendChild(el22);
// r2.classList.add('row');
// content.appendChild(r2);
fetch(window.location.href + 'views/content.html').then(data => data.text()).then(data => {
  cw.innerHTML = data;
});

var pos = { x: getHiddenOffset() };

function toggleContent() {
  bg.classList.add('animating');
  bg.classList.toggle('view-content');
  let xOffset = bg.classList.contains('view-content') ? 525 : getHiddenOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
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