// TODO:

//---- EXPLORE
//  CSS3D Renderer for titles, text, and buttons maybe (https://github.com/mrdoob/three.js/blob/master/examples/css3d_periodictable.html)
//  CSS3D Renderer + WebGL Renderer work together (https://stackoverflow.com/questions/37446746/threejs-how-to-use-css3renderer-and-webglrenderer-to-render-2-objects-on-the-sa)
//  Make Renderers transparent and hopefully they overlay

//---- DESIGN
//  Cube design
//  Button design
//  Title design
//  Title font (typeface.json format)
//  Page content
//  Page font
//  Live gradient in background?

//---- ELEMENTS
//  Add cube rotation buttons
//  Add page buttons

//---- FIXES and STUFF


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
  LEFT: Symbol('L'),
  UP: Symbol('U')
};

var CURRENT_STATE = State.MENU;

var camera, spotLight;
var scene, renderer;
// 3D objects
var cube, frontend, backend, design, me;
var rad90 = Math.PI / 2;

var textureLoader, jsonLoader;
var obj3d, pivot;

var neb1, neb2, star1, star2, star3, star4;
var mainTitle, p1Title, p2Title, p3Title, p4Title;

// Rotation calculations in animate()
// rotYOffset for State.INIT, initial cube rotation
// rotZOffset for State.MENU after cube rotates upward (xneg)
var rotYOffset = 0, rotZOffset = 0, t = 0, csin;

// Used for intersection of objects in render()
var mouse = new THREE.Vector2(), raycaster, INTERSECTED;
var html = document.querySelector('html');

var w1, w2, w3, w4;

//--------------------------------------------------------------------------------------------------
// Initialization of 3D Scene / Objects
//--------------------------------------------------------------------------------------------------

// init();
// animate();

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
  // color, intensity, distance, angle, penumbra, decay
  spotLight = new THREE.SpotLight(0xffffbb, 1);
  spotLight.position.set(0.5,0,25);
  spotLight.position.multiplyScalar(800);
  scene.add(spotLight);
  spotLight.castShadow = true;
  // spotLight.shadow.mapSize.width = 1024;
  // spotLight.shadow.mapSize.height = 1024;
  // spotLight.shadow.camera.near = 200;
  // spotLight.shadow.camera.far = 1500;
  // spotLight.shadow.camera.fov = 40;
  // spotLight.shadow.bias = -0.005;

  // CUBE
  var geometry = new THREE.BoxBufferGeometry(200, 200, 200);

  var pre = 'images/cube-0';
  var imgs = ['1', '2', 'ignore', 'ignore', '5', '6'];
  var suff = '.jpg';
  var materialArr = [];
  for (let i = 0; i < 6; i++) {
    if (i !== 2 && i !== 3) {
      materialArr.push(new THREE.MeshBasicMaterial({
        map: textureLoader.load(pre + imgs[i] + suff)
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

  pivot = new THREE.Group();
  pivot.add(obj3d);

  scene.add(pivot);

  // RAYCASTER
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
  jsonLoader.load('scripts/models/' + shape + '.js', function(g) {
    obj = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ shininess: 100, map: textureLoader.load('textures/uv_' + shape + '.png') }));
    obj.position.set(posx,posy,posz); obj.rotation.set(rotx,roty,rotz); obj.scale.set(scale,scale,scale); obj.name = name; obj3d.add(obj);
  });
}

//--------------------------------------------------------------------------------------------------
// Animate / Render
//--------------------------------------------------------------------------------------------------

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  if (CURRENT_STATE === State.MENU || CURRENT_STATE === State.INIT) {
    t += 0.0015; //0.00098;
    csin = 0.24 * Math.sin(t);

    star1.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 175) + ',0,0,1)';
    neb1.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 150) + ',0,0,1)';
    star2.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 200) + ',0,0,1)';
    neb2.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 500) + ',0,0,1)';
    star3.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 625) + ',0,0,1)';
    star4.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (csin * 950) + ',0,0,1)';

    switch(CURRENT_STATE) {
      case State.MENU:
        pivot.rotation.y = csin + rotYOffset;
        break;
      default: break;
    }
  } else if (CURRENT_STATE !== State.ROTATING && t !== 0) {
    t = 0;
    // if we want the cube to return to the sinusoidal position, 
    // get rid of t = 0 and add a TWEEN animation to restore csin to cube.rotation.y
  }

  render();
};

// RENDERING
function render() {
  TWEEN.update();

  // Check intersection of 3D button objects
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(obj3d.children);
  if (intersects.length > 0 && intersects[0].object.name !== 'cube') {
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

function up() {
  //neb1.style.top = '10%';
  //img2.style.top = '10%';
  CURRENT_STATE = State.ROTATING;
  // Fade initBtn OUT (needs work)
  new TWEEN.Tween(scene.getObjectByName('initBtn').material).to({ opacity: 0 }, 680)
    .easing(TWEEN.Easing.Circular.Out)
    .onComplete(function() {
      removeEntity('initBtn');
    })
    .start();

  // Recenter the Cube y rotation
  new TWEEN.Tween(pivot.rotation).to({ y: 0 }, 220)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() {
      t = 0;
      // Fade Page 1 Text Title IN
      // new TWEEN.Tween(scene.getObjectByName('michael text').material).to({ opacity: 1 }, 680)
      // .easing(TWEEN.Easing.Circular.In)
      // .start();
    })
    .start();

  // Rotate Cube Upwards -90 radians
  new TWEEN.Tween(pivot.rotation).to({ x: pivot.rotation.x - rad90 }, 1240)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { 
      CURRENT_STATE = State.MENU;
      updatePage(Direction.UP);
    })
    .start();
};

function left() {
  CURRENT_STATE = State.ROTATING;
  new TWEEN.Tween(pivot.rotation).to({ y: pivot.rotation.y + rad90 }, 680)
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
  new TWEEN.Tween(pivot.rotation).to({ y: pivot.rotation.y - rad90, }, 680)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { 
      CURRENT_STATE = State.MENU; 
      rotYOffset -= rad90;
      updatePage(Direction.RIGHT);
    })
    .start();
};

function focus() {
  CURRENT_STATE = State.FOCUSING;
  // Reset rotation offset
  new TWEEN.Tween(pivot.rotation).to({ y: pivot.rotation.y + -(csin) }, 220)
    .easing(TWEEN.Easing.Quintic.Out)
    .start();
  // Fix this zoom in to be dynamic based on the size of the cube and aspect ratio of the window
  new TWEEN.Tween(camera.position).to({ z: -101 }, 1680) // 275, z: 101
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { 
      CURRENT_STATE = State.PAGE;
      loadPageContent(); 
    })
    .start();
};

function destroy() {
  destroyPageContent();
  CURRENT_STATE = State.FOCUSING;
  new TWEEN.Tween(camera.position).to({ z: 700 }, 680)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(function() { CURRENT_STATE = State.MENU; })
    .start();
};

var CURRENT_PAGE = 1;
function updatePage(dir) {
  switch (dir) {
    case Direction.UP:
      CURRENT_PAGE = 1;
      break;
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
// Loading / Removing Content
//--------------------------------------------------------------------------------------------------

function loadPageContent() {
  var page = document.createElement('div');
  page.id = 'pageContent';
  var body = document.querySelector('body');
  body.appendChild(page);
  
  var url = '/';
  switch (CURRENT_PAGE) {
    case 1: url += 'frontend'; break;
    case 2: url += 'backend'; break;
    case 3: url += 'me'; break;
    case 4: url += 'design'; break;
    default: break;
  }
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector('#pageContent').innerHTML = data;
    var scr = document.createElement('script');
    scr.src = 'scripts/flicker.js';
    page.appendChild(scr);
  })
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

function ready() {
  init();
  animate()
}
// DOM ready
if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}