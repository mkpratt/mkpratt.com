//--------------------------------------------------------------------------------------------------
// Dynamic Page Content
//--------------------------------------------------------------------------------------------------

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
cw.style.transform = 'translateX(500px)';
cw.style.position = 'absolute';
cw.style.zIndex = '2000';
document.body.appendChild(cw);

fetch(window.location.href + 'views/content.html').then(data => data.text()).then(data => {
  cw.innerHTML = data;
  resizeContent();
});

function toggleContent() {
  bg.classList.add('animating');
  bg.classList.toggle('view-content');
  let xOffset = bg.classList.contains('view-content') ? 525 : getBGOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
};

//--------------------------------------------------------------------------------------------------
// Calculate Content Sizing and Aspect Ratios
//--------------------------------------------------------------------------------------------------

function getBGOffset() {
  return window.innerWidth + 20 + (window.innerHeight / 2 * Math.tan(getTanDeg(23)));
};
function calculateOffset() {
  let xOffset = bg.classList.contains('view-content') ? 525 : getBGOffset();
  bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
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
  cw.style.width = getContentWidth() + 'px';
  cw.style.margin = getContentMargin() + 'px 0';
  let rows = document.querySelectorAll('.row');
  rows.forEach(function(row, rIdx) {
    let children = Array.from(row.children);
    let rh = row.clientHeight;
    let rowWidth = 0;
    children.forEach(function(child, cIdx) {
      // 9x16 Ratio
      //let ratioWidth = rh + (rh/2);
      let ratioWidth = rh + (7*(rh / 9));
      // Last row, first and last child
      if (rIdx === 2 && (cIdx === 0 || cIdx === 2)) {
        // 3x4 Ratio
        ratioWidth = rh + (rh / 3);
      }
      child.style.width = ratioWidth + 'px';
    })
  })
};

//--------------------------------------------------------------------------------------------------
// Event Listeners
//--------------------------------------------------------------------------------------------------

window.addEventListener('resize', function () {
  calculateOffset();
  resizeContent();
});

//--------------------------------------------------------------------------------------------------
// Helper Functions
//--------------------------------------------------------------------------------------------------

function getTanDeg(deg) {
  var rad = deg * Math.PI / 180;
  return Math.tan(rad);
};