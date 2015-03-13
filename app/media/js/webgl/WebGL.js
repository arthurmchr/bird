/* global glslify */

var THREE = require('three');
var dat = require('dat-gui');

function WebGL(width, height) {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

	this.camera.position.z = 500;

	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.renderer.setSize(width, height);
	this.renderer.setClearColor(0x000000);

	// DAT GUI

	var GUIParams = function() {
		this.radius = 160;
		this.tube = 80;
		this.radialSegments = 160;
		this.tubularSegments = 10;
		this.p = 2;
		this.q = 3;
		this.redrawTorus = function() {
			this.scene.remove(torusKnot);

			torusKnotGeo = new THREE.TorusKnotGeometry(guiParams.radius, guiParams.tube, guiParams.radialSegments, guiParams.tubularSegments, guiParams.p, guiParams.q);
			torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotShader);
			this.scene.add(torusKnot);
		};
	};

	var gui = new dat.GUI();
	var guiParams = new GUIParams();
	guiParams.redrawTorus = guiParams.redrawTorus.bind(this);

	gui.add(guiParams, 'radius', 1).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'tube', 1).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'radialSegments', 3).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'tubularSegments', 2).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'p', 0).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'q', 0).onChange(guiParams.redrawTorus);

	gui.close();

	// Textures

	var mapTexture = THREE.ImageUtils.loadTexture('/media/img/snake-map.jpg');
	mapTexture.wrapS = mapTexture.wrapT = THREE.RepeatWrapping;
	mapTexture.repeat.set(30, 6);

	// Objects

	var torusKnotGeo = new THREE.TorusKnotGeometry(guiParams.radius, guiParams.tube, guiParams.radialSegments, guiParams.tubularSegments, guiParams.p, guiParams.q);
	//var torusKnotMat = new THREE.MeshPhongMaterial({
	//	map: mapTexture
		//specularMap: THREE.ImageUtils.loadTexture('obj/leeperrysmith/Map-SPEC.jpg'),
		//normalMap: THREE.ImageUtils.loadTexture( "obj/leeperrysmith/Infinite-Level_02_Tangent_SmoothUV.jpg" ),
	//});

	var torusGLSL = glslify({
		vertex: '../glsl/torus-vertex.glsl',
		fragment: '../glsl/torus-fragment.glsl',
		sourceOnly: true
	});
	var torusKnotShader = new THREE.ShaderMaterial({
		uniforms: {
			time: {
				type: 'f',
				value: 1.0
			}
		},
		vertexShader: torusGLSL.vertex,
		fragmentShader: torusGLSL.fragment
	});

	var torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotShader);
	this.scene.add(torusKnot);

	// Light

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 1, 0);
	this.scene.add(directionalLight);
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
