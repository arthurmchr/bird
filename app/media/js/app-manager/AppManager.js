var raf = require('raf');
var WebGL = require('../webgl');

function AppManager() {
	this.animate = this.animate.bind(this);
	this.resizeEvent = this.resizeEvent.bind(this);
	this.mouseMoveEvent = this.mouseMoveEvent.bind(this);

	this.webGL = new WebGL(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGL.renderer.domElement);

	window.addEventListener('resize', this.resizeEvent);
	window.addEventListener('mousemove', this.mouseMoveEvent);

	this.animate();
}

AppManager.prototype.resizeEvent = function() {
	this.webGL.resize(window.innerWidth, window.innerHeight);
};

AppManager.prototype.mouseMoveEvent = function(event) {
	this.webGL.mouseMove(event.clientX, event.clientY);
};

AppManager.prototype.animate = function() {
	raf(this.animate);

	this.webGL.render();
};

module.exports = AppManager;
