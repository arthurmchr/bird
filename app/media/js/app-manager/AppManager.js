var raf = require('raf');
var WebGL = require('../webgl');
var TimelineMax = require('timelinemax');
var TweenMax = require('tweenmax');

function AppManager() {
	this.animate = this.animate.bind(this);
	this.resizeEvent = this.resizeEvent.bind(this);
	this.mouseMoveEvent = this.mouseMoveEvent.bind(this);

	this.webGL = new WebGL(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGL.renderer.domElement);

	window.addEventListener('resize', this.resizeEvent);
	window.addEventListener('mousemove', this.mouseMoveEvent);

	this.animate();

	var tl = new TimelineMax();

	tl.to('.tile__bar', 0.8, {
		width: '100%',
		onComplete: function() {
			var current = this.target[0];

			current.style.right = 0;
			TweenMax.to(current, 0.3, {
				width: 0,
				delay: 0.3
			});
		}
	})
	.from('.intro__container__group__bck', 0.6, {
		scale: window.innerHeight / document.getElementsByClassName('intro__container__group__bck')[0].offsetHeight
	})
	.to('.title span', 0.5, {
		opacity: 1,
		y: 0
	}, '-=0.5')
	.from('.border--l', 0.4, {
		height: 0
	}, '-=0.1')
	.from('.border--t', 0.4, {
		width: 0
	})
	.from('.border--r', 0.4, {
		height: 0
	}, '-=0.8')
	.from('.border--b', 0.4, {
		width: 0
	}, '-=0.4')
	.to('.intro__container__group', 0.4, {
		yPercent: -100,
		delay: 1.6
	})
	.to('.border--l', 0.3, {
		height: 0
	}, '-=0.3')
	.to('.border--t', 0.3, {
		width: 0
	})
	.to('.border--r', 0.3, {
		height: 0
	}, '-=0.8')
	.to('.border--b', 0.3, {
		width: 0
	}, '-=0.4');
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
