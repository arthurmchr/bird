var THREE = require('three');
//var Snake = require('../meshes/snake');
var Bird = require('../meshes/bird');

function WebGL(width, height) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	this.currentX = 0;

	this.camera.position.z = 500;
	this.scene.add(this.camera);

	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.renderer.setSize(width, height);
	this.renderer.setClearColor(0x000000);

	/*********************************************/

	/* Lights ************************************/

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	//directionalLight.position.set(-0.1, 1, 0.1);
	directionalLight.position.set(-0.1, 1, 1);
	this.scene.add(directionalLight);

	this.mouseScreenX = 0;

	/*********************************************/

	/* Meshes ************************************/

	//this.snake = new Snake();
	//this.scene.add(this.snake.mesh);

	this.bird = new Bird();
	this.scene.add(this.bird.mesh);

	/*********************************************/

	/* Clock *************************************/

	this.clock = new THREE.Clock();
}

WebGL.prototype.resize = function(width, height) {
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

WebGL.prototype.mouseMove = function(x) {
	this.mouseScreenX = ((x - window.innerWidth / 2) * 10) * 0.01;
};

WebGL.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
	var delta = this.clock.getDelta();

	this.camera.position.x += (this.mouseScreenX - this.camera.position.x) * 0.4;
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));

	//this.snake.render(delta);
	this.bird.render(delta);
};

module.exports = WebGL;
