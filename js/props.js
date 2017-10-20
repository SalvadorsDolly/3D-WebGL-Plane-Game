Sea = function() {
	var geom = new THREE.CylinderGeometry( 600, 600, 800, 40, 10 );
	geom.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI/2 ));
	geom.mergeVertices();
	var l = geom.vertices.length;

	this.waves = [];

	for (var i=0;i<l;i++){
    var v = geom.vertices[i];
    this.waves.push({y:v.y,
                     x:v.x,
                     z:v.z,
                     ang:Math.random()*Math.PI*2,
					 amp:5 + Math.random()*15,
                     speed:0.016 + Math.random()*0.032
    });
}

	var mat = new THREE.MeshPhongMaterial( {
		color : Colors.blue, 
		transparent : true,
		opacity : .6,
		shading: THREE.FlatShading
	} );

	this.mesh = new THREE.Mesh( geom, mat );

	this.mesh.receiveShadow = true;
}

var sea;

function createSea() {
	sea = new Sea();
	sea.mesh.position.y = -600;

	scene.add( sea.mesh );
}

Cloud = function() {

	this.mesh = new THREE.Object3D();

	var geom = new THREE.BoxGeometry( 20, 20, 20 );

	var mat = new THREE.MeshPhongMaterial( {color:Colors.white, } );

	//creation of clouds, materials and random placement of blocks in cloud build
	var nBlocs = 3+Math.floor( Math.random()*3 );
	for ( var i=0; i<nBlocs; i++ ) {
		var m = new THREE.Mesh( geom, mat );

		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		//block scale
		var s = .1 + Math.random()*.9;
		m.scale.set( s, s, s );
		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add( m );

	}
}

// sky function duplicates and places clouds
Sky = function() {
	this.mesh = new THREE.Object3D();
	this.nClouds = 20;

	var stepAngle = Math.PI*2 / this.nClouds;
	for ( var i=0; i<this.nClouds; i++ ) {
		var c = new Cloud();
		var a = stepAngle*i;
		var h = 750 + Math.random()*200;
		// set positions of clouds, Math.sin, Math.cos returning -1 thru 1
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h

		c.mesh.rotation.z = a + Math.PI/2;

		c.mesh.position.z = -400-Math.random()*400;
		//scale
		var s = 1+Math.random()*2;
		c.mesh.scale.set( s, s, s );

		this.mesh.add(c.mesh);
	}
}

var sky;

function createSky() {
	sky = new Sky();
	sky.mesh.position.y = -600;

	scene.add(sky.mesh);
}

// creation of Airplane
var Airplane = function() {
	this.mesh = new THREE.Object3D();
	// create cockpit
	var geomCockpit = new THREE.BoxGeometry( 80, 50, 50, 1, 1, 1 );
	var matCockpit = new THREE.MeshPhongMaterial( {color: Colors.red, shading:THREE.FlatShading} );

	geomCockpit.vertices[4].y-=10;
	geomCockpit.vertices[4].z+=20;
	geomCockpit.vertices[5].y-=10;
	geomCockpit.vertices[5].z-=20;
	geomCockpit.vertices[6].y+=30;
	geomCockpit.vertices[6].z+=20;
	geomCockpit.vertices[7].y+=30;
	geomCockpit.vertices[7].z-=20;

	var cockpit = new THREE.Mesh( geomCockpit, matCockpit );

	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);

	// create engine
	var geomEngine = new THREE.BoxGeometry( 20,50,50,1,1,1 );
	var matEngine = new THREE.MeshPhongMaterial( {color:Colors.white, shading:THREE.FlatShading} );
	var engine = new THREE.Mesh( geomEngine, matEngine );
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);

	// create airplane tail
	var geomTail = new THREE.BoxGeometry( 15,20,5,1,1,1 );
	var matTail =  new THREE.MeshPhongMaterial( {color:Colors.red, shading:THREE.FlatShading} );
	var tailPlane = new THREE.Mesh( geomTail, matTail );
	tailPlane.position.set( -35,25,0 );
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

	// create wings 
	var geomSideWing = new THREE.BoxGeometry( 40,8,150,1,1,1 );
	var matSideWing = new THREE.MeshPhongMaterial( {color:Colors.red, shading:THREE.FlatShading} );
	var sideWing = new THREE.Mesh( geomSideWing, matSideWing );
	sideWing.position.set( 0, 15, 0 );
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

	//create windShield
	var windShieldGeom = new THREE.BoxGeometry( 3, 15, 20, 1, 1, 1 );
	var windShieldMat = new THREE.MeshPhongMaterial( {color:Colors.white, transparent:true, opacity:0.4, shading:THREE.SmoothShading} );
	var windShield = new THREE.Mesh( windShieldGeom, windShieldMat );
	windShield.position.set( 5, 27, 0 );
	windShield.castShadow = true;
	windShield.receiveShadow = true;
	this.mesh.add(windShield);

	// create propeller
	var geomPropeller = new THREE.BoxGeometry( 20,10,10,1,1,1 );
	var matPropeller = new THREE.MeshPhongMaterial( {color:Colors.brown, shading:THREE.FlatShading} );
	this.propeller = new THREE.Mesh( geomPropeller, matPropeller );
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;

	var geomBlade = new THREE.BoxGeometry( 1,100,20,1,1,1 );
	var matBlade = new THREE.MeshPhongMaterial( {color:Colors.brownDark, shading:THREE.FlatShading} );
	var blade = new THREE.Mesh( geomBlade, matBlade );
	blade.position.set( 8, 0, 0 );
	blade.castShadow = true;
	blade.receiveShadow = true;

	this.propeller.add(blade);
	this.propeller.position.set( 50, 0, 0 );
	this.mesh.add( this.propeller );

	// create wheel protector
	var wheelGeom = new THREE.BoxGeometry( 30, 15, 10, 1, 1, 1 );
	var wheelMat = new THREE.MeshPhongMaterial( { color:Colors.red, shading:THREE.FlatShading } );
	var wheelProR = new THREE.Mesh( wheelGeom, wheelMat );
	wheelProR.position.set( 25, -20, 25 );
	this.mesh.add( wheelProR );

	//create tires
	var tireGeom = new THREE.BoxGeometry( 24, 24, 4 );
	var tireMat = new THREE.MeshPhongMaterial( {color:Colors.blueda, shading:THREE.FlatShading} );
	var tireR = new THREE.Mesh( tireGeom, tireMat );
	tireR.position.set( 25, -28, 25 );
	//create wheel Axis
	var axisGeom = new THREE.BoxGeometry( 10, 10, 6 );
	var axisMat = new THREE.MeshPhongMaterial( {color:Colors.brownDark, shading:THREE.FlatShading} );
	var axel = new THREE.Mesh( axisGeom, axisMat );
	tireR.add( axel );
	this.mesh.add( tireR );

	// create left wheels, tires, etc
	var wheelProL = wheelProR.clone();
  	wheelProL.position.z = -wheelProR.position.z ;
  	this.mesh.add( wheelProL );

  	var tireL = tireR.clone();
 	tireL.position.z = -tireR.position.z;
  	this.mesh.add( tireL );

 	var tireB = tireR.clone();
 	tireB.scale.set(.5,.5,.5);
 	tireB.position.set(-35,-5,0);
  	this.mesh.add( tireB );

  	this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10,27,0);
    this.mesh.add(this.pilot.mesh);


    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

};

var airplane;

function createPlane() {
	airplane = new Airplane();
	airplane.mesh.scale.set( .25, .25, .25 );
	airplane.mesh.position.y = 100;
	scene.add( airplane.mesh );
}

//create the Pilot of plane
var Pilot = function() {
	this.mesh = new THREE.Object3D();
	this.mesh.name = "pilot";
	this.angleHairs = 0;

	//pilots body
	var bodyGeom = new THREE.BoxGeometry( 15, 15, 15 );
	var bodyMat = new THREE.MeshPhongMaterial( { color:Colors.brown, shading:THREE.FlatShading} );
	var body = new THREE.Mesh( bodyGeom, bodyMat );
	body.position.set( 2, -12, 0 );
	this.mesh.add( body );

	//pilots face
	var faceGeom = new THREE.BoxGeometry( 10, 10, 10 );
	var faceMat = new THREE.MeshLambertMaterial( {color:Colors.pink,} );
	var face = new THREE.Mesh( faceGeom, faceMat );
	this.mesh.add( face );

	//pilots hair
	var hairGeom = new THREE.BoxGeometry( 4, 4, 4 );
	var hairMat = new THREE.MeshLambertMaterial( { color:Colors.brown } );
	var hair = new THREE.Mesh( hairGeom, hairMat );
	hair.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 2, 0 ) );
	var hairs = new THREE.Object3D();

	this.hairsTop = new THREE.Object3D();

	for ( var i=0; i<12; i++) {
		var h = hair.clone();
		var col = i%3;
		var row = Math.floor( i/3 );
		var startPosZ = -4;
		var startPosX = -4;
		h.position.set(startPosX + row*4, 0, startPosZ + col*4);
		h.geometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, 1 ));
		this.hairsTop.add( h );
	}

	hairs.add(this.hairsTop);

	var hairSideGeom = new THREE.BoxGeometry( 12, 4, 2 );
	hairSideGeom.applyMatrix( new THREE.Matrix4().makeTranslation( -6, 0, 0 ));
	var hairSideR = new THREE.Mesh( hairSideGeom, hairMat );
	var hairSideL = hairSideR.clone();
	//hair position
	hairSideR.position.set( 8, -2, 6 );
	hairSideL.position.set( 8, -2, -6 );
	hairs.add(hairSideR);
	hairs.add(hairSideL);

	var hairBackGeom = new THREE.BoxGeometry( 2, 8, 10 );
	hairBack = new THREE.Mesh( hairBackGeom, hairMat );
	hairBack.position.set( -1, -4, 0 );
	hairs.add( hairBack );
	hairs.position.set( -5, 5, 0 );

	this.mesh.add( hairs );

	//glass
	var glassGeom = new THREE.BoxGeometry( 5, 5, 5 );
	var glassMat = new THREE.MeshLambertMaterial( { color:Colors.brown } );
	var glassR = new THREE.Mesh( glassGeom, glassMat );
	glassR.position.set( 6, 0, 3 );
	var glassL = glassR.clone();
	glassL.position.z = -glassR.position.z

	var glassAGeom = new THREE.BoxGeometry( 11, 1, 11 );
	var glassA = new THREE.Mesh( glassAGeom, glassMat );
	this.mesh.add( glassR );
	this.mesh.add( glassL );
	this.mesh.add( glassA );

	var earGeom = new THREE.BoxGeometry( 2, 3, 2 );
	var earL = new THREE.Mesh( earGeom, faceMat );
	earL.position.set(0,0,-6);
	var earR = earL.clone();
	earR.position.set(0,0,6);
	this.mesh.add(earL);
	this.mesh.add(earR);
}

Pilot.prototype.updateHairs = function(){
	var hairs = this.hairsTop.children;

  	var l = hairs.length;
  	for (var i=0; i<l; i++){
    	var h = hairs[i];
    	h.scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;
  }
  	this.angleHairs += 0.16;
}


