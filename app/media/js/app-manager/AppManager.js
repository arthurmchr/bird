var raf = require('raf');
var WebGL = require('../webgl');
var TimelineMax = require('timelinemax');
var TweenMax = require('tweenmax');
var createjs = require('preloadjs');

function AppManager() {
	this.animate = this.animate.bind(this);
	this.resizeEvent = this.resizeEvent.bind(this);
	this.mouseMoveEvent = this.mouseMoveEvent.bind(this);

	this.webGL = new WebGL(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGL.renderer.domElement);

	window.addEventListener('resize', this.resizeEvent);
	window.addEventListener('mousemove', this.mouseMoveEvent);

	this.tl = new TimelineMax({
		paused: true
	});

	this.tl.fromTo('.intro__container__group__bck', 0.6, {
		scale: window.innerHeight / document.getElementsByClassName('intro__container__group__bck')[0].offsetHeight
	}, {
		scale: 1
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

	this.loadingFile();

	/*********************************************/

	/* Start loop ********************************/

	this.animate();
}

AppManager.prototype.loadingFile = function() {
	var _this = this;

	var queue = new createjs.LoadQueue();

	queue.on('progress', function(event) {
		TweenMax.killTweensOf('.tile__bar');
		TweenMax.to('.tile__bar', 0.8, {
			width: (event.loaded * 75) + '%'
		});
	});

	queue.on('complete', function() {
		_this.tl.play();

		TweenMax.killTweensOf('.tile__bar');
		TweenMax.to('.tile__bar', 1, {
			width: 100 + '%',
			onComplete: function() {
				document.getElementsByClassName('tile__bar')[0].style.right = 0;
				TweenMax.to('.tile__bar', 0.8, {
					width: 0
				});
			}
		});
	});

	queue.loadFile('/media/img/bird-map.jpg');
};

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
