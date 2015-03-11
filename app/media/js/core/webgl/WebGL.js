var THREE = require('three');

function WebGL(width, height) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, width, height, 0.1, 1000);

	this.camera.position.z = 500;

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(width, height);
	this.renderer.setClearColor(0x000000);
}

WebGL.prototype.resize = function(width, height) {
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

WebGL.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
};

module.exports = WebGL;
