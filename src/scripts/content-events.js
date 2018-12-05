//--------------------------------------------------------------------------------------------------
// Dynamic Page Content
//--------------------------------------------------------------------------------------------------

var projectsVisible = false;
var bgSkewOffset = window.innerHeight * Math.tan(getTanDeg(23));
let bg = document.createElement('div');
bg.id = 'bg';
bg.classList.add('bg');
// make it extra wide so we don't see overflow
bg.style.width = window.innerWidth + (4 * bgSkewOffset) + 'px';
bg.style.transform = 'skewX(-23deg) translateX(' + getBGOffset() + 'px)';
bg.addEventListener('transitionend', function onTransitionEnd() {
  bg.classList.remove('background-animating', 'background-animating-slow');
});
document.body.appendChild(bg);

let pw = document.createElement('div');
pw.id = 'projectsWrapper';
pw.style.transform = 'translateX(50000px)';
pw.style.position = 'absolute';
pw.style.zIndex = '2000';
pw.addEventListener('transitionend', function onTransitionEnd() {
  pw.classList.remove('projects-animating');
});
document.body.appendChild(pw);

fetch(window.location.href + 'views/projects-template.html').then(data => data.text()).then(data => {
  pw.innerHTML = data;
  resizeProjects();
});

// Background functions
function showBackground() {
  bg.classList.add('background-animating');
  bg.classList.add('open');
  bg.style.transform = 'skewX(-23deg) translateX(525px)';
};
function hideBackground() {
  bg.classList.add('background-animating');
  bg.classList.remove('open');
  bg.style.transform = 'skewX(-23deg) translateX(' + getBGOffset() + 'px)';
};

// Projects functions
function showProjects() {
  pw.style.transform = 'translateX(500px)';
  projectsVisible = true;
  pw.classList.add('projects-animating');
  pw.classList.add('view-projects');
};
function hideProjects() {
  projectsVisible = false;
  pw.classList.add('projects-animating');
  pw.addEventListener('transitionend', function _func() {
    pw.style.transform = 'translateX(50000px)';
    pw.removeEventListener('transitionend', _func);
  });
  pw.classList.remove('view-projects');
};

// Project details functions
function showDetails() {
  CURRENT_STATE = State.PROJECTDETAILS;
  bg.classList.add('showing-details');
  bg.classList.add('background-animating-slow');
  hideProjects();
  
  bg.addEventListener('transitionend', function _func() {
    bg.classList.remove('showing-details');
    bg.classList.add('detailed-view');
    bg.removeEventListener('transitionend', _func);

    // Show detailed content
    let header = document.querySelector('#detailsHeader');
    header.addEventListener('transitionend', function _hfunc() {
      header.classList.remove('details-animating');
      header.removeEventListener('transitionend', _hfunc);

      // Show title
      let title = header.querySelector('#titleWrapper');
      title.addEventListener('transitionend', function _tfunc() {
        title.classList.remove('details-animating');
        title.removeEventListener('transitionend', _tfunc);
      });
      title.classList.add('title-in');
      title.classList.add('details-animating');

      // Show icons
      let icons = document.querySelector('#iconRow');
      icons.addEventListener('transitionend', function _ifunc() {
        icons.classList.remove('details-animating');
        icons.removeEventListener('transitionend', _ifunc);
      });
      icons.classList.add('details-animating');
      icons.classList.add('icons-in');

      // Show content
      let wrapper = document.querySelector('#detailsWrapper');
      wrapper.addEventListener('transitionend', function _wfunc(){
        wrapper.classList.remove('details-animating');
        wrapper.removeEventListener('transitionend', _wfunc);
      });
      wrapper.classList.add('wrapper-in');
      wrapper.classList.add('details-animating');
    });

    header.classList.add('details-animating');
    header.classList.add('header-in');
  });

  bg.style.transform = 'skewX(-23deg) translateX(' + -(bgSkewOffset) + 'px)';
};
function hideDetails() {
  CURRENT_STATE = State.PROJECTSOVERVIEW;
  bg.innerHTML = '';
  bg.classList.remove('detailed-view');
  bg.classList.add('hiding-details');

  // Remove title
  let title = document.querySelector('#titleWrapper');
  title.addEventListener('transitionend', function _tfunc() {
    title.classList.remove('details-animating');    
    title.removeEventListener('transitionend', _tfunc);
  });
  title.classList.add('details-animating');  
  title.classList.remove('title-in');

  // Remove icons
  let icons = document.querySelector('#iconRow');
  icons.addEventListener('transitionend', function _wfunc() {
    icons.classList.remove('details-animating');
    icons.removeEventListener('transitionend', _wfunc);
  });
  icons.classList.add('details-animating');
  icons.classList.remove('icons-in');

  // Remove wrapper
  let wrapper = document.querySelector('#detailsWrapper');
  wrapper.addEventListener('transitionend', function _wfunc() {
    wrapper.classList.remove('details-animating');
    wrapper.removeEventListener('transitionend', _wfunc);
  });
  wrapper.classList.add('details-animating');
  wrapper.classList.remove('wrapper-in');

  // Remove header
  let header = document.querySelector('#detailsHeader');
  header.addEventListener('transitionend', function _hfunc() {
    header.classList.remove('details-animating');
    header.removeEventListener('transitionend', _hfunc);
  });
  header.classList.add('details-animating-delay');
  header.classList.remove('header-in');

  // wait for the header to finish before transitioning to the overview
  // delay = 2 * transition delay (320) title + header transitions
  setTimeout(projectsOverview, 640);
};
function projectsOverview() {
  // Remove project details, load project overview
  document.body.removeChild(document.querySelector('#projectDetails'));
  bg.addEventListener('transitionend', function _func() {
    bg.classList.remove('hiding-details');
    bg.removeEventListener('transitionend', _func);
    // load projects again
    loadProjects();
  });
  bg.classList.add('background-animating');
  bg.style.transform = 'skewX(-23deg) translateX(525px)';
};

//--------------------------------------------------------------------------------------------------
// Calculate Projects Sizing and Aspect Ratios
//--------------------------------------------------------------------------------------------------

function getBGOffset() {
  return window.innerWidth + 20 + (window.innerHeight / 2 * Math.tan(getTanDeg(23)));
};
function calculateOffset() {
  if (CURRENT_STATE !== State.PROJECTDETAILS) {
    let xOffset = bg.classList.contains('open') ? 525 : getBGOffset();
    bg.style.transform = 'skewX(-23deg) translateX(' + xOffset + 'px)';
  }
};
function getProjectsHeight() {
  return (window.innerHeight * .8);
};
function getProjectsMargin() {
  return (window.innerHeight * .1);
};
function getProjectsWidth() {
  return (window.innerWidth - 540);
};

function resizeProjects() {
  pw.style.height = getProjectsHeight() + 'px';
  pw.style.width = getProjectsWidth() + 'px';
  pw.style.margin = getProjectsMargin() + 'px 0';
  let rows = document.querySelectorAll('.row');
  rows.forEach(function(row, rIdx) {
    let children = Array.from(row.children);
    let rh = row.clientHeight;
    let rowWidth = 0;
    children.forEach(function(child, cIdx) {
      // 9x16 Ratio
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
  if (CURRENT_STATE === State.PROJECTSOVERVIEW) {
    resizeProjects();
  }
});

//--------------------------------------------------------------------------------------------------
// Helper Functions
//--------------------------------------------------------------------------------------------------

function getTanDeg(deg) {
  var rad = deg * Math.PI / 180;
  return Math.tan(rad);
};