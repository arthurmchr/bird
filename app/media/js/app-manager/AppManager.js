var raf = require('raf');
var WebGL = require('../webgl');
var TimelineMax = require('timelinemax');

function AppManager() {
	this.animate = this.animate.bind(this);
	this.resizeEvent = this.resizeEvent.bind(this);
	this.mouseMoveEvent = this.mouseMoveEvent.bind(this);

	this.webGL = new WebGL(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGL.renderer.domElement);

	window.addEventListener('resize', this.resizeEvent);
	window.addEventListener('mousemove', this.mouseMoveEvent);

	this.animate();

	var tl = new TimelineMax({
		paused: true
	});

	tl.from('.border--t', 0.4, {
		width: 0
	});
	tl.from('.border--r', 0.4, {
		height: 0
	});
	tl.from('.border--b', 0.4, {
		width: 0
	});
	tl.from('.border--l', 0.4, {
		height: 0
	});

	tl.restart();
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
