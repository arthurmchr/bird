var THREE = require('three');

function Snake() {

	var torusKnotGeo = new THREE.TorusKnotGeometry(160, 80, 160, 10);

	var mapTexture = THREE.ImageUtils.loadTexture('/media/img/snake-map.jpg');
	mapTexture.wrapS = mapTexture.wrapT = THREE.RepeatWrapping;

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

		/* jshint camelcase:false */
		/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */

		vertexShader: [

			'varying vec2 vUv;',
			'varying vec3 vNormal;',
			'varying vec3 vViewPosition;',

			THREE.ShaderChunk.lights_phong_pars_vertex,

			'void main() {',

				'vUv = uv;',
				'vNormal = normal;',

				THREE.ShaderChunk.lights_phong_vertex,

				'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',

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
			THREE.ShaderChunk.bumpmap_pars_fragment,
			THREE.ShaderChunk.normalmap_pars_fragment,
			THREE.ShaderChunk.specularmap_pars_fragment,
			THREE.ShaderChunk.lights_phong_pars_fragment,

			'void main() {',

				'vec2 uvTimeShift = vUv * vec2(30.0, 6.0) + vec2(-1.0, -0.3) * time * speed;',
				'vec4 texelColor = texture2D(map, uvTimeShift);',
				'gl_FragColor = texelColor;',

				THREE.ShaderChunk.specularmap_fragment,

				THREE.ShaderChunk.lights_phong_fragment,

			'}'

		].join('\n'),

		/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
		/* jshint camelcase:true */

		lights: true
	});

	torusKnotShader.map = true;
	torusKnotShader.uniforms.map.value = mapTexture;

	//torusKnotShader.uniforms.specularMap = ;
	//torusKnotShader.uniforms.bumpMap = ;
	//torusKnotShader.uniforms.normalMap = ;

	this.mesh = new THREE.Mesh(torusKnotGeo, torusKnotShader);
}

Snake.prototype.render = function(delta) {
	this.mesh.material.uniforms.time.value += delta;
};

module.exports = Snake;
