var THREE = require('three');

function Bird() {

	this.gravity = new THREE.Vector3(0, -0.75, 0);
	this.mesh = new THREE.Object3D();
	this.meshes = [];

	// radius, tube, radialSeg, tubularSeg

	var torusKnotGeo = new THREE.TorusKnotGeometry(160, 80, 40, 8);

	var mapTexture = THREE.ImageUtils.loadTexture('/media/img/11133-v4.jpg');
	mapTexture.wrapS = mapTexture.wrapT = THREE.RepeatWrapping;

	var furTexure = new THREE.Texture(this.generateTexture());
	furTexure.needsUpdate = true;
	furTexure.wrapS = furTexure.wrapT = THREE.RepeatWrapping;

	var i;
	var shells;

	for (i = 0, shells = 30; i < shells; i++) {

		var material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib.common,
				THREE.UniformsLib.bump,
				THREE.UniformsLib.normalmap,
				THREE.UniformsLib.lights,
				{
					map: {
						type: 't',
						value: null
					},
					hairMap: {
						type: 't',
						value: null
					},
					offset:	{
						type: 'f',
						value: i / shells
					},
					time: {
						type: 'f',
						value: 0.0
					},
					speed: {
						type: 'f',
						value: 0.025
					},
					gravity: {
						type: 'v3',
						value: this.gravity
					}
				}
			]),

			/* jshint camelcase:false */
			/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

			vertexShader: [

				'uniform float offset;',
				'uniform vec3 gravity;',

				'varying vec3 vNormal;',
				'varying vec3 vViewPosition;',

				THREE.ShaderChunk.map_pars_vertex,
				THREE.ShaderChunk.lights_phong_pars_vertex,

				'void main() {',

					THREE.ShaderChunk.map_vertex,
					THREE.ShaderChunk.defaultnormal_vertex,

					/*********************************************/

					/* Gravity ***********************************/

					'float displacementFactor = pow(offset, 3.0);',
					'vec3 aNormal = transformedNormal;',
					'aNormal.xyz += gravity * displacementFactor;',
					'vec3 animated = position + (normalize(aNormal) * offset * 60.0);',

					'vNormal = normalize(transformedNormal * aNormal);',

					THREE.ShaderChunk.default_vertex,

					'gl_Position = projectionMatrix * modelViewMatrix * vec4(animated, 1.0);',

					'vViewPosition = -mvPosition.xyz;',

					THREE.ShaderChunk.lights_phong_vertex,

				'}'
			].join('\n'),
			fragmentShader: [

				'uniform vec3 diffuse;',
				'uniform vec3 emissive;',
				'uniform vec3 specular;',
				'uniform float shininess;',
				'uniform float opacity;',

				'uniform sampler2D hairMap;',
				'uniform float offset;',
				'uniform float time;',
				'uniform float speed;',

				THREE.ShaderChunk.common,
				THREE.ShaderChunk.map_pars_fragment,
				THREE.ShaderChunk.bumpmap_pars_fragment,
				THREE.ShaderChunk.normalmap_pars_fragment,
				THREE.ShaderChunk.specularmap_pars_fragment,
				THREE.ShaderChunk.lights_phong_pars_fragment,

				'void main() {',

					'vec3 outgoingLight = vec3(0.0);',
					'vec4 diffuseColor = vec4(diffuse, opacity);',

					'vec2 uvTimeShift = vUv * vec2(5.0, 1.0) + vec2(-1.0, -0.3) * time * speed;',
					'vec4 texelColor = texture2D(map, uvTimeShift);',
					'diffuseColor *= texelColor;',

					'vec2 uvTimeShiftHair = vUv * vec2(20.0, 2.0) + vec2(-1.0, -0.3) * time * speed;',
					'vec4 hairColor = texture2D(hairMap, uvTimeShiftHair);',

					// Discard no hairs + above the max length

					'if (hairColor.r == 0.0 || hairColor.g < offset) {',
						'discard;',
					'}',

					THREE.ShaderChunk.specularmap_fragment,
					THREE.ShaderChunk.lights_phong_fragment,

					'gl_FragColor = vec4(outgoingLight, diffuseColor.a);',

				'}'
			].join('\n'),

			/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
			/* jshint camelcase:true */

			lights: true
		});

		material.map = true;
		material.uniforms.map.value = mapTexture;
		material.uniforms.hairMap.value = furTexure;

		var newMesh = new THREE.Mesh(torusKnotGeo, material);
		this.meshes.push(newMesh);
		this.mesh.add(newMesh);
	}
}

Bird.prototype.generateTexture = function() {
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = 256;

	var ctx = canvas.getContext('2d');

	for (var i = 0; i < 10000; i++) {
		ctx.fillStyle = 'rgb(255, ' + Math.floor(Math.random() * 255) + ', 0)';

		ctx.fillRect((Math.random() * canvas.width), (Math.random() * canvas.height), 2, 2);
	}

	return canvas;
};

Bird.prototype.render = function(delta) {

	var i;
	var ln;

	for (i = 0, ln = this.meshes.length; i < ln; i++) {
		this.meshes[i].material.uniforms.time.value += delta;
	}
};

module.exports = Bird;
