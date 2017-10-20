// core colours used variables
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	blueDark:040647
};

// variables for the THREE library
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
renderer, container;

//mouse variable
var mousePos = { x:0, y:0 };

// create the stage like in a play, along with camera and vfx
function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;

	camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );

	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

	renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );

	renderer.setSize( HEIGHT / WIDTH );
	renderer.shadowMap.enabled = true;

	container = document.getElementById( 'world' );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', handleWindowResize, false );
}


function init( event ){
	createScene();
	createLights();
	createPlane();
	createSea();
	createSky();

	document.addEventListener( 'mousemove', handleMouseMove, false );

	loop();
}

//events of window resize
function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize( WIDTH, HEIGHT );
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

// setting up lighting
var ambientLight, hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight( 0xaaaaaa,0x000000, .9 );

	shadowLight = new THREE.DirectionalLight( 0xffffff, .9 );

	shadowLight.position.set( 150, 350, 350 );
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add( hemisphereLight );
	scene.add( shadowLight );
}

//function to handle mouse interaction
function handleMouseMove( event ) {
	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;

	mousePos = { x:tx, y:ty };
}

//create animation render loops and update player character movement
function loop() {
  updatePlane();
  sea.mesh.rotation.z += .005;
  sky.mesh.rotation.z += .01;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);

}

//function updates plane movements associated with mouse interaction
function updatePlane(){
  var targetY = normalize( mousePos.y, -.75, .75, 25, 175 );
  var targetX = normalize( mousePos.x, -.75, .75, -100, 100 );

  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  airplane.propeller.rotation.x += 0.3;
}
// syncs with screen render space
function normalize( v, vmin, vmax, tmin, tmax ) {
	var nv = Math.max( Math.min( v, vmax ), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}



window.addEventListener( 'load', init, false);