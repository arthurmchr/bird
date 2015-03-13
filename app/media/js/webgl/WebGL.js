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
			this.scene.remove(torusKnot);

			torusKnotGeo = new THREE.TorusKnotGeometry(guiParams.radius, guiParams.tube, guiParams.radialSegments, guiParams.tubularSegments);
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

	gui.close();

	// Textures

	var mapTexture = THREE.ImageUtils.loadTexture('/media/img/snake-map.jpg');
	mapTexture.wrapS = mapTexture.wrapT = THREE.RepeatWrapping;
	mapTexture.repeat.set(30, 6);

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
				ambient: {
					type: 'c',
					value: new THREE.Color(0xffffff)
				},
				emissive: {
					type: 'c',
					value: new THREE.Color(0x000000)
				},
				specular: {
					type: 'c',
					value: new THREE.Color(0x111111)
				},
				shininess: {
					type: 'f',
					value: 30
				},
				map: {
					type: 't',
					value: mapTexture
				}
			}
		]),

		vertexShader: [

			'#define PHONG',

			'varying vec3 vViewPosition;',
			'varying vec3 vNormal;',

			THREE.ShaderChunk.map_pars_vertex,
			THREE.ShaderChunk.lightmap_pars_vertex,
			THREE.ShaderChunk.envmap_pars_vertex,
			THREE.ShaderChunk.lights_phong_pars_vertex,
			THREE.ShaderChunk.color_pars_vertex,

			'void main() {',

				THREE.ShaderChunk.map_vertex,
				THREE.ShaderChunk.lightmap_vertex,
				THREE.ShaderChunk.color_vertex,

				THREE.ShaderChunk.defaultnormal_vertex,

				'vNormal = normalize(transformedNormal);',

				THREE.ShaderChunk.default_vertex,

				'vViewPosition = -mvPosition.xyz;',

				THREE.ShaderChunk.envmap_vertex,
				THREE.ShaderChunk.lights_phong_vertex,

			'}'

		].join('\n'),

		fragmentShader: [

			'#define PHONG',

			'uniform vec3 diffuse;',
			'uniform float opacity;',

			'uniform vec3 ambient;',
			'uniform vec3 emissive;',
			'uniform vec3 specular;',
			'uniform float shininess;',

			THREE.ShaderChunk.color_pars_fragment,
			THREE.ShaderChunk.map_pars_fragment,
			THREE.ShaderChunk.lightmap_pars_fragment,
			THREE.ShaderChunk.envmap_pars_fragment,
			THREE.ShaderChunk.lights_phong_pars_fragment,
			THREE.ShaderChunk.bumpmap_pars_fragment,
			THREE.ShaderChunk.normalmap_pars_fragment,
			THREE.ShaderChunk.specularmap_pars_fragment,
			THREE.ShaderChunk.logdepthbuf_pars_fragment,

			'void main() {',

				'gl_FragColor = vec4(vec3(1.0), opacity);',

				THREE.ShaderChunk.logdepthbuf_fragment,
				THREE.ShaderChunk.map_fragment,
				THREE.ShaderChunk.specularmap_fragment,

				THREE.ShaderChunk.lights_phong_fragment,

				THREE.ShaderChunk.lightmap_fragment,
				THREE.ShaderChunk.color_fragment,
				THREE.ShaderChunk.envmap_fragment,

				THREE.ShaderChunk.linear_to_gamma_fragment,

			'}'

		].join('\n'),

		lights: true//,
		//map: true
	});

	/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
	/* jshint camelcase:true */

	var torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotShader);
	this.scene.add(torusKnot);

	torusKnotShader.map = true;
	//mapTexture.needsUpdate = true;
	//torusKnotShader.needsUpdate = true;

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
