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
		this.redrawTorus = function() {
			this.scene.remove(this.torusKnot);

			torusKnotGeo = new THREE.TorusKnotGeometry(guiParams.radius, guiParams.tube, guiParams.radialSegments, guiParams.tubularSegments);
			this.torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotShader);
			this.scene.add(this.torusKnot);
		};
	};

	var gui = new dat.GUI();
	var guiParams = new GUIParams();
	guiParams.redrawTorus = guiParams.redrawTorus.bind(this);

	gui.add(guiParams, 'radius', 1).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'tube', 1).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'radialSegments', 3).onChange(guiParams.redrawTorus);
	gui.add(guiParams, 'tubularSegments', 2).onChange(guiParams.redrawTorus);

	gui.close();

	// Textures

	var mapTexture = THREE.ImageUtils.loadTexture('/media/img/snake-map.jpg');
	mapTexture.wrapS = mapTexture.wrapT = THREE.RepeatWrapping;

	// Objects

	var torusKnotGeo = new THREE.TorusKnotGeometry(guiParams.radius, guiParams.tube, guiParams.radialSegments, guiParams.tubularSegments);

	/* jshint camelcase:false */
	/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

	var torusKnotShader = new THREE.ShaderMaterial({
		uniforms: THREE.UniformsUtils.merge([

			THREE.UniformsLib.common,
			THREE.UniformsLib.bump,
			THREE.UniformsLib.normalmap,
			THREE.UniformsLib.lights,
			{
				time: {
					type: 'f',
					value: 0.0
				},
				speed: {
					type: 'f',
					value: 0.2
				}
			}
		]),

		vertexShader: [

			'varying vec3 vViewPosition;',
			'varying vec3 vNormal;',

			THREE.ShaderChunk.map_pars_vertex,
			THREE.ShaderChunk.lights_phong_pars_vertex,

			'void main() {',

				THREE.ShaderChunk.map_vertex,

				'vNormal = normal;',

				// default_vertex

				'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',

				THREE.ShaderChunk.lights_phong_vertex,

			'}'

		].join('\n'),

		fragmentShader: [

			'uniform vec3 diffuse;',
			'uniform vec3 ambient;',
			'uniform vec3 emissive;',
			'uniform vec3 specular;',
			'uniform float shininess;',

			'uniform float time;',
			'uniform float speed;',

			THREE.ShaderChunk.map_pars_fragment,
			THREE.ShaderChunk.lights_phong_pars_fragment,
			THREE.ShaderChunk.bumpmap_pars_fragment,
			THREE.ShaderChunk.normalmap_pars_fragment,
			THREE.ShaderChunk.specularmap_pars_fragment,

			'void main() {',

				// map_fragment,

				'vec2 uvTimeShift = vUv * vec2(30.0, 6.0) + vec2(-1.0, -0.3) * time * speed;',
				'vec4 texelColor = texture2D(map, uvTimeShift);',
				'gl_FragColor = texelColor;',

				THREE.ShaderChunk.specularmap_fragment,

				THREE.ShaderChunk.lights_phong_fragment,

			'}'

		].join('\n'),

		lights: true
	});

	torusKnotShader.map = true;
	torusKnotShader.uniforms.map.value = mapTexture;

	//torusKnotShader.uniforms.specularMap = ;
	//torusKnotShader.uniforms.bumpMap = ;
	//torusKnotShader.uniforms.normalMap = ;

	/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
	/* jshint camelcase:true */

	this.torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotShader);
	this.scene.add(this.torusKnot);

	// Light

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(-0.1, 1, 0.1);
	this.scene.add(directionalLight);

	this.clock = new THREE.Clock();
	this.mouseScreenX = 0;
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

	this.torusKnot.material.uniforms.time.value += this.clock.getDelta();

	this.camera.position.x = this.mouseScreenX * 0.025;
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
};

module.exports = WebGL;
