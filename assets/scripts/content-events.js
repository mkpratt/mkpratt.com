let bg = document.createElement('div');
bg.id = 'bg';
bg.classList.add('bg');
bg.style.transform = 'skewX(-23deg) translateX(' + getBGOffset() + 'px)';
bg.addEventListener('transitionend', function onTransitionEnd() {
  bg.classList.remove('animating');
});
document.body.appendChild(bg);

let cw = document.createElement('div');
cw.id = 'content-wrapper';
resizeContent()
cw.style.transform = 'translateX(540px)';
cw.style.position = 'absolute';
cw.style.zIndex = '2000';
document.body.appendChild(cw);

fetch(window.location.href + 'views/content.html').then(data => data.text()).then(data => {
  cw.innerHTML = data;
});

function toggleContent() {
  bg.classList.add('animating');
  bg.classList.toggle('view-content');
  let xOffset = bg.classList.contains('view-content') ? 525 : getBGOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
};

function getBGOffset() {
  return window.innerWidth + 20 + (window.innerHeight / 2 * Math.tan(getTanDeg(23)));
};
function getContentHeight() {
  return (window.innerHeight * .8);
};
function getContentMargin() {
  return (window.innerHeight * .1);
};
function getContentWidth() {
  return (window.innerWidth - 540);
};
function resizeContent() {
  cw.style.height = getContentHeight() + 'px';
  cw.style.margin = getContentMargin() + 'px 0';
  cw.style.width = getContentWidth() + 'px';
}

function getTanDeg(deg) {
  var rad = deg * Math.PI / 180;
  return Math.tan(rad);
};

//--------------------------------------------------------------------------------------------------
// Event Listeners
//--------------------------------------------------------------------------------------------------

window.addEventListener('resize', function () {
  let xOffset = bg.classList.contains('view-content') ? 525 : getBGOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
  resizeContent()
});