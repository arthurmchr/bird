var WebGL = require('./core/webgl');
var raf = require('raf');
var dat = require('dat-gui');

function Main() {
	this.animate = this.animate.bind(this);
	this.resizeEvent = this.resizeEvent.bind(this);

	this.webGL = new WebGL(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGL.renderer.domElement);

	var GUIParams = function() {
		this.test = 'hello';
	};

	var gui = new dat.GUI();
	var guiParams = new GUIParams();

	gui.add(guiParams, 'test');

	window.addEventListener('resize', this.resizeEvent);

	this.animate();
}

Main.prototype.resizeEvent = function() {
	this.webGL.resize(window.innerWidth, window.innerHeight);
};

Main.prototype.animate = function() {
	raf(this.animate);

	this.webGL.render();
};

new Main();
