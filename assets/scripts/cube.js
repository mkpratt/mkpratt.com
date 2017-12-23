// TODO:
//  Page content
//  Page font
//  Live gradient in background?

'use strict';

//--------------------------------------------------------------------------------------------------
// Globals / Instantiation
//--------------------------------------------------------------------------------------------------

const State = {
  INIT: Symbol('INIT'),
  MENU: Symbol('MENU'),
  PAGE: Symbol('PAGE'),
  ROTATING: Symbol('ROTATING'),
  FOCUSING: Symbol('FOCUSING')
};

const Direction = {
  RIGHT: Symbol('R'),
  LEFT: Symbol('L')
};

var CURRENT_STATE = State.MENU;

var camera, spotLight;
var scene, renderer;

var cube, frontend, backend, design, me;
var rad90 = Math.PI / 2;

var textureLoader, jsonLoader;
var obj3d;

var neb1, neb2, star1, star2, star3, star4;

var rotYOffset = 0, rotZOffset = 0, t = 0, csin;

var mouse = new THREE.Vector2(), raycaster, INTERSECTED;
var html = document.querySelector('html');

//--------------------------------------------------------------------------------------------------
// Initialization of 3D Scene / Objects
//--------------------------------------------------------------------------------------------------

function init() {
  textureLoader = new THREE.TextureLoader();
  jsonLoader = new THREE.JSONLoader();

  // CAMERA
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 700;

  // SCENE
  scene = new THREE.Scene();
  obj3d = new THREE.Object3D();

  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
  spotLight = new THREE.SpotLight(0xffffbb, 1);
  spotLight.position.set(0.5,0,25);
  spotLight.position.multiplyScalar(800);
  scene.add(spotLight);
  spotLight.castShadow = true;

  // CUBE
  var geometry = new THREE.BoxBufferGeometry(200, 200, 200);

  var pre = 'assets/images/cube-0';
  var imgs = ['1', '2', 'ignore', 'ignore', '5', '6'];
  var suff = '.jpg';
  var materialArr = [];
  for (let i = 0; i < 6; i++) {
    if (i !== 2 && i !== 3) {
      materialArr.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load(pre + imgs[i] + suff),
        transparent: true
      }));
    } else {
      materialArr.push(new THREE.MeshBasicMaterial({ color: 0x000000 }));
    }
  }
  var material = new THREE.MultiMaterial(materialArr);
  cube = new THREE.Mesh(geometry, material);
  cube.position.y = 0;
  cube.name = 'cube';
  obj3d.add(cube);

  loadJson('triangle', frontend, 0, 16, 100, rad90, -2.095, 0, 94, 'frontend');
  loadJson('circle', backend, 100, 1, 0, rad90-0.56, 0, -rad90, 72, 'backend');
  loadJson('pentagon', design, -100, -5, 0, rad90, 0, rad90, 80, 'design');
  loadJson('square', me, 0, 6.5, -100, -rad90, Math.PI, 0, 77.5, 'me');

  scene.add(obj3d);

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.zIndex = 100;
  document.body.appendChild(renderer.domElement);

  // EVENT LISTENERS
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('click', onDocumentMouseClick, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);

  // IMAGE ELEMENTS
  neb1 = document.getElementById('nebula1');
  neb2 = document.getElementById('nebula2');
  star1 = document.getElementById('stars1');
  star2 = document.getElementById('stars2');
  star3 = document.getElementById('stars3');
  star4 = document.getElementById('stars4');
};

async function loadJson(shape, obj, posx, posy, posz, rotx, roty, rotz, scale, name) {
  jsonLoader.load('assets/scripts/models/' + shape + '.js', function(g) {
    obj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ shininess: 100, map: textureLoader.load('assets/textures/uv_' + shape + '.png'), transparent: true }));
    obj.position.set(posx,posy,posz); obj.rotation.set(rotx,roty,rotz); obj.scale.set(scale,scale,scale); obj.name = name; obj3d.add(obj);
  });
};

//--------------------------------------------------------------------------------------------------
// Animate / Render
//--------------------------------------------------------------------------------------------------

function animate() {
  requestAnimationFrame(animate);
  if (CURRENT_STATE !== State.ROTATING) {
    t += 0.0015; 
    csin = 0.24 * Math.sin(t);
    // Image Positions
    star1.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 175) + ',0,0,1)';
    neb1.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 150) + ',0,0,1)';
    star2.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 200) + ',0,0,1)';
    neb2.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 500) + ',0,0,1)';
    star3.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 625) + ',0,0,1)';
    star4.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 950) + ',0,0,1)';
    // Object Rotation
    obj3d.rotation.y = csin + rotYOffset;
  }
  render();
};

function render() {
  TWEEN.update();
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(obj3d.children);
  if (intersects.length > 0 && intersects[0].object.name !== 'cube') {
    // TODO: Don't make the cursor a pointer if it's not the current page object
    html.style.cursor = 'pointer';
    INTERSECTED = intersects[0].object;
  } else {
    if (html.style.cursor !== 'default') html.style.cursor = 'default';
    INTERSECTED = null;
  }
  renderer.render(scene, camera);
};

//--------------------------------------------------------------------------------------------------
// Cube Rotations
//--------------------------------------------------------------------------------------------------

function left() {
  CURRENT_STATE = State.ROTATING;
  new TWEEN.Tween(obj3d.rotation).to({ y: obj3d.rotation.y + rad90 }, 680)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { 
      CURRENT_STATE = State.MENU; 
      rotYOffset += rad90;
      updatePage(Direction.LEFT);
    })
    .start();
};

function right() {
  CURRENT_STATE = State.ROTATING;
  new TWEEN.Tween(obj3d.rotation).to({ y: obj3d.rotation.y - rad90, }, 680)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { 
      CURRENT_STATE = State.MENU; 
      rotYOffset -= rad90;
      updatePage(Direction.RIGHT);
    })
    .start();
};

var CURRENT_PAGE = 1;
function updatePage(dir) {
  switch (dir) {
    case Direction.RIGHT:
      CURRENT_PAGE++;
      if (CURRENT_PAGE > 4) CURRENT_PAGE = 1;
      break;
    case Direction.LEFT:
      CURRENT_PAGE--;
      if (CURRENT_PAGE < 1) CURRENT_PAGE = 4;
      break;
    default:
      break;
  }
};

//--------------------------------------------------------------------------------------------------
// Focus / Destroy Page Animations
//--------------------------------------------------------------------------------------------------

function focus() {
  CURRENT_STATE = State.FOCUSING;
  new TWEEN.Tween(camera.position).to({ z: 1000 }, 480)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { 
      CURRENT_STATE = State.PAGE;
      loadPageContent(); 
    })
    .start();
  setOpacity(0);  
};

function destroy() {
  destroyPageContent();
  CURRENT_STATE = State.FOCUSING;
  new TWEEN.Tween(camera.position).to({ z: 700 }, 480)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { CURRENT_STATE = State.MENU; })
    .start();
  setOpacity(1);  
};

async function setOpacity(op) {
  obj3d.traverse(function(o) {
    o.children.forEach(function(el) {
      if (el.material && el.material.transparent) {
        new TWEEN.Tween(el.material).to({opacity: op}, 300)
          .easing(TWEEN.Easing.Quintic.Out)
          .start();
      } else {
        let elmats = el.material.materials;
        for (let i = 0; i < elmats.length; i++) {
          new TWEEN.Tween(elmats[i]).to({opacity: op}, 360)
            .easing(TWEEN.Easing.Quintic.Out)
            .start();
        }
      }
    });
  });
};

//--------------------------------------------------------------------------------------------------
// Loading / Removing Content
//--------------------------------------------------------------------------------------------------

function loadPageContent() {
  var page = document.createElement('div');
  page.id = 'pageContent';
  var body = document.querySelector('body');
  body.appendChild(page);
  
  var url = window.location.href + 'views/';
  switch (CURRENT_PAGE) {
    case 1: url += 'frontend.html'; break;
    case 2: url += 'backend.html'; break;
    case 3: url += 'me.html'; break;
    case 4: url += 'design.html'; break;
    default: break;
  }
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector('#pageContent').innerHTML = data;
    var scr = document.createElement('script');
    scr.src = 'assets/scripts/flicker.js';
    page.appendChild(scr);
  });
};

function destroyPageContent() {
  var page = document.querySelector('#pageContent');
  page.parentNode.removeChild(page);
};

//--------------------------------------------------------------------------------------------------
// Event Listeners
//--------------------------------------------------------------------------------------------------

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// Raycaster
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;
};

// 3D object clicks
function onDocumentMouseClick(event) {
  event.preventDefault();
  if (INTERSECTED) {
    switch (INTERSECTED.name) {
      case 'initBtn':
        up();
        break;
      case 'frontend':
      case 'backend':
      case 'design':
      case 'me':
        focus();
        break;
      default:
        break;
    }
  }
};

// Keyboard input
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode !== 37 && keyCode !== 39 && keyCode !== 187 && keyCode !== 189) return;
  switch (CURRENT_STATE) {
    case State.MENU:
      if (keyCode === 37) left();
      else if (keyCode === 39) right();
      else if (keyCode === 187) focus();
      break;
    case State.PAGE:
      if (keyCode === 189) destroy();
      break;
    default: break;
  }
};

// Call when DOM ready
function ready() {
  init();
  animate()
};
// DOM ready
if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}