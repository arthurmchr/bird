var THREE = require('three');
var Snake = require('../meshes/snake');
var Bird = require('../meshes/bird');
//var dat = require('dat-gui');

function WebGL(width, height) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

	this.camera.position.z = 500;
	this.scene.add(this.camera);

	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.renderer.setSize(width, height);
	this.renderer.setClearColor(0x000000);

	// DAT GUI

	// var GUIParams = function() {
	// 	this.radius = 160;
	// 	this.tube = 80;
	// 	this.radialSegments = 160;
	// 	this.tubularSegments = 10;
	// 	this.redrawTorus = function() {
	// 		this.scene.remove(this.torusKnot);

	// 		torusKnotGeo = new THREE.TorusKnotGeometry(guiParams.radius, guiParams.tube, guiParams.radialSegments, guiParams.tubularSegments);
	// 		this.torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotShader);
	// 		this.scene.add(this.torusKnot);
	// 	};
	// };

	// var gui = new dat.GUI();
	// var guiParams = new GUIParams();
	// guiParams.redrawTorus = guiParams.redrawTorus.bind(this);

	// gui.add(guiParams, 'radius', 1).onChange(guiParams.redrawTorus);
	// gui.add(guiParams, 'tube', 1).onChange(guiParams.redrawTorus);
	// gui.add(guiParams, 'radialSegments', 3).onChange(guiParams.redrawTorus);
	// gui.add(guiParams, 'tubularSegments', 2).onChange(guiParams.redrawTorus);

	// gui.close();

	// Lights

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	//directionalLight.position.set(-0.1, 1, 0.1);
	directionalLight.position.set(-0.1, 1, 1);
	this.scene.add(directionalLight);

	this.mouseScreenX = 0;

	// Meshes

	this.snake = new Snake();
	//this.scene.add(this.snake.mesh);

	this.bird = new Bird();
	this.scene.add(this.bird.mesh);

	// Clock

	this.clock = new THREE.Clock();
}

WebGL.prototype.resize = function(width, height) {
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

WebGL.prototype.mouseMove = function(x) {
	this.mouseScreenX = (x - window.innerWidth / 2) * 10;
};

WebGL.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
	var delta = this.clock.getDelta();

	this.camera.position.x = this.mouseScreenX * 0.025;
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.snake.render(delta);
	this.bird.render(delta);
};

module.exports = WebGL;
