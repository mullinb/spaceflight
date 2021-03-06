'use strict';


Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = `http://chandlerprall.github.io/Physijs/examples/js/ammo.js`;

var container, stats;
var camera, controls, scene, renderer;


var d, dPlanet, dMoon, dMoonVec = new THREE.Vector3();
var clock = new THREE.Clock();

var container = document.body;

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild( renderer.domElement );


scene = new Physijs.Scene;
scene.setGravity(new THREE.Vector3(0,-1000,0));

var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.8, 12600 * 100000)

camera.position.set( 500, 500, 500 );

var gun = new THREE.Mesh(
new THREE.CylinderGeometry (40, 40, 300),
new THREE.MeshPhongMaterial({ color: 0x97ff03})
)

gun.position.z = -250;
gun.position.x = 120;
gun.position.y = 90;
gun.rotateX(Math.PI/2);

camera.add(gun)

scene.add(camera);


var controls = new THREE.FlyControls(camera, container);
controls.movementSpeed = 9505.3;
controls.domElement = container;
controls.rollSpeed = Math.PI / 6;
controls.autoForward = false;
controls.dragToLook = false;

// renderer.shadowMapEnabled = true;
// renderer.shadowMapType = THREE.PCFSoftShadowMap;



var light = new THREE.AmbientLight(0xFFFFFF, .2)

scene.add(light)

var light = new THREE.PointLight(0xFFFFFF, 3);
light.position.set( 100, 0, 100 );
scene.add(light)
light.castShadow = true;


var floorGeometry = new THREE.BoxGeometry( 25000, 250, 25000 );
var floorMaterial = new THREE.MeshBasicMaterial( { side: THREE.BackSide} );
floorMaterial.map = new THREE.TextureLoader().load('/space2.jpg');
var floorMesh = new Physijs.ConvexMesh(floorGeometry, floorMaterial, 0);
floorMesh.position.set( 0, -5000, 0);

floorMesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
});

var side1Geometry = new THREE.BoxGeometry( 250, 5000, 25000 );
var side1Material = new THREE.MeshBasicMaterial( { side: THREE.BackSide} );
side1Material.map = new THREE.TextureLoader().load('/space2.jpg');
var side1Mesh = new Physijs.ConvexMesh(side1Geometry, side1Material, 0);
side1Mesh.position.set(12500, -3500, 0);

side1Mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
});

var side2Geometry = new THREE.BoxGeometry( 25000, 5000, 250 );
var side2Material = new THREE.MeshBasicMaterial( { side: THREE.BackSide} );
side2Material.map = new THREE.TextureLoader().load('/space2.jpg');
var side2Mesh = new Physijs.ConvexMesh(side2Geometry, side2Material, 0);
side2Mesh.position.set( 0, -3500, 12500);

side2Mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
});

var side3Geometry = new THREE.BoxGeometry( 250, 5000, 25000 );
var side3Material = new THREE.MeshBasicMaterial( { side: THREE.BackSide} );
side3Material.map = new THREE.TextureLoader().load('/space2.jpg');
var side3Mesh = new Physijs.ConvexMesh(side3Geometry, side3Material, 0);
side3Mesh.position.set( -12500, -3500, 0);

side3Mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
});

var side4Geometry = new THREE.BoxGeometry( 25000, 5000, 250 );
var side4Material = new THREE.MeshBasicMaterial( { side: THREE.BackSide} );
side4Material.map = new THREE.TextureLoader().load('/space2.jpg');
var side4Mesh = new Physijs.ConvexMesh(side4Geometry, side4Material, 0);
side4Mesh.position.set( 0, -3500, -12500);

side4Mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
});


scene.add(floorMesh)
scene.add(side1Mesh)
scene.add(side2Mesh)
scene.add(side3Mesh)
scene.add(side4Mesh)


var box = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 400, 400, 400 ),
    new THREE.MeshPhongMaterial({ color: 0x97ff03}), 1
);

box.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    scene.remove(box);
});

box.setCcdMotionThreshold(5);
box.setCcdSweptSphereRadius(1);

scene.add( box );


var render = function() {
    var delta = clock.getDelta();
    controls.update(delta);
    scene.simulate();
    // moveCylinders();
    // TWEEN.update();

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

var i = 0;
var cylinder = []
var bulletSpeed = 20000;

var map = {};

var allowed = true;
var timer;

document.addEventListener('keydown', function(e) {
  if (e.repeat != undefined) {
    allowed = !e.repeat;
  }
  if (!allowed) return;
  allowed = false;
  if (e.key === " ") {
      e.preventDefault()
      generateBullet();
      timer = setInterval(generateBullet, 166);
  }
});

document.addEventListener('keyup', function(e) {
    if (e.key === " ") {
        clearInterval(timer);
        allowed = true;
    }
});


function generateBullet () {

    var merged = new THREE.Geometry();
    var cyl = new THREE.CylinderGeometry(30, 30, 210);
    var top = new THREE.CylinderGeometry(30, 20, 50);
    var bot = new THREE.CylinderGeometry(30, 20, 50);
    var matrix2 = new THREE.Matrix4();
    matrix2.makeTranslation(0, 110, 0);
    top.applyMatrix(matrix2);
    var matrix2 = new THREE.Matrix4();
    matrix2.makeTranslation(0, -130, 0);
    bot.applyMatrix(matrix2);
    merged.merge(top);
    merged.merge(bot);
    merged.merge(cyl);
    var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    // let d = new THREE.vector3();
    cylinder[i] = new Physijs.CapsuleMesh(merged, material, 1);
    gun.add(cylinder[i]);
    cylinder[i].position.x = gun.getWorldPosition().x;
    cylinder[i].position.y = gun.getWorldPosition().y;
    cylinder[i].position.z = gun.getWorldPosition().z;


    cylinder[i].setRotationFromEuler(gun.getWorldRotation());
    cylinder[i].translateY(-280);


    cylinder[i].addEventListener('ready', function() {
        let self = cylinder[i];
        setTimeout(function() {
            scene.remove( self );

        }, 3000)
        // this.applyCentralImpulse(new THREE.Vector3(camera.getWorldDirection().x * 100000000000, camera.getWorldDirection().y * 100000000000, camera.getWorldDirection().z * 100000000000));
        var force = new THREE.Vector3(camera.getWorldDirection().x * bulletSpeed, camera.getWorldDirection().y * bulletSpeed, camera.getWorldDirection().z * bulletSpeed);
        cylinder[i].applyCentralImpulse(force);
        i++
    });
    scene.add(cylinder[i]);
}



function handleWindowResize() {
    // update height and width of the renderer and the camera
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', handleWindowResize);

render();
