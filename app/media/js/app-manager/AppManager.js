var raf = require('raf');
var WebGL = require('../webgl');

function AppManager() {
	this.animate = this.animate.bind(this);
	this.resizeEvent = this.resizeEvent.bind(this);

	this.webGL = new WebGL(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGL.renderer.domElement);

	window.addEventListener('resize', this.resizeEvent);

	this.animate();
}

AppManager.prototype.resizeEvent = function() {
	this.webGL.resize(window.innerWidth, window.innerHeight);
};

AppManager.prototype.animate = function() {
	raf(this.animate);

	this.webGL.render();
};

module.exports = AppManager;
