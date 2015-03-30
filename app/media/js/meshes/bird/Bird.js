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
				THREE.UniformsLib.lights,
				{
					colorMap: {
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
						value: 0.2
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
				'uniform float time;',
				'uniform vec3 gravity;',

				'varying vec2 vUv;',
				'varying vec3 vNormal;',
				'varying vec3 vViewPosition;',

				THREE.ShaderChunk.lights_phong_pars_vertex,

				'void main() {',

					'vUv = uv;',
					'vec3 aNormal = normal;',

					// Gravity

					'vec3 displacement = gravity;',

					'float displacementFactor = pow(offset, 3.0);',

					'aNormal.xyz += displacement * displacementFactor;',

					// Move outwards depending on offset(layer) and normal + force + gravity

					'vec3 animated = position + (normalize(aNormal) * offset * 60.0);',

					'vNormal = normalize(normal * aNormal);',

					'gl_Position = projectionMatrix * modelViewMatrix * vec4(animated, 1.0);',

					THREE.ShaderChunk.lights_phong_vertex,

				'}'
			].join('\n'),
			fragmentShader: [
				'uniform vec3 diffuse;',
				'uniform vec3 ambient;',
				'uniform vec3 emissive;',
				'uniform vec3 specular;',
				'uniform float shininess;',

				'uniform sampler2D colorMap;',
				'uniform sampler2D hairMap;',
				'uniform float offset;',
				'uniform float time;',
				'uniform float speed;',

				'varying vec2 vUv;',

				THREE.ShaderChunk.specularmap_pars_fragment,
				THREE.ShaderChunk.lights_phong_pars_fragment,

				'void main() {',

					'vec2 uvTimeShift = vUv + vec2(-1.0, -0.3) * time * speed;',
					//'vec2 uvTimeShiftRepeat = vUv * vec2(20.0, 2.0) + vec2(-1.0, -0.3) * time * speed;',

					'vec4 col = texture2D(colorMap, vUv);',
					'vec4 hairColor = texture2D(hairMap, vUv * vec2(20.0, 2.0));',

					// Discard no hairs + above the max length

					'if (hairColor.a <= 0.0 || hairColor.g < offset) {',
						'discard;',
					'}',

					'gl_FragColor = vec4(col.xyz, 1.1 - offset);',

					THREE.ShaderChunk.specularmap_fragment,

					//THREE.ShaderChunk.lights_phong_fragment,

					'vec3 normal = normalize( vNormal );',
					'vec3 viewPosition = normalize( vViewPosition );',
					'#if MAX_DIR_LIGHTS > 0',

						'vec3 dirDiffuse = vec3( 0.0 );',
						'vec3 dirSpecular = vec3( 0.0 );',

						'for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {',

							'vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );',
							'vec3 dirVector = normalize( lDirection.xyz );',

							'float dotProduct = dot( normal, dirVector );',

							'#ifdef WRAP_AROUND',

								'float dirDiffuseWeightFull = max( dotProduct, 0.0 );',
								'float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );',

								'vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );',

							'#else',

								'float dirDiffuseWeight = max( dotProduct, 0.0 );',

							'#endif',

							'dirDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;',

							'vec3 dirHalfVector = normalize( dirVector + viewPosition );',
							'float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );',
							'float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );',

							'float specularNormalization = ( shininess + 2.0 ) / 8.0;',

							'vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );',
							'dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;',

						'}',

					'#endif',

					'vec3 totalDiffuse = vec3( 0.0 );',
					'vec3 totalSpecular = vec3( 0.0 );',

					'#if MAX_DIR_LIGHTS > 0',

						'totalDiffuse += dirDiffuse;',
						'totalSpecular += dirSpecular;',

					'#endif',

					'gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;',

				'}'
			].join('\n'),

			/* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
			/* jshint camelcase:true */

			transparent: true,
			lights: true
		});

		material.uniforms.colorMap.value = mapTexture;
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
		ctx.fillStyle = 'rgb(255, ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')';

		ctx.fillRect((Math.random() * canvas.width), (Math.random() * canvas.height), 2, 2);
	}

	return canvas;
};

Bird.prototype.render = function(delta) {

	var i;
	var ln;

	for (i = 0, ln = this.meshes.length; i < ln; i++) {
		this.meshes[i].material.uniforms.time.value = delta;
	}
};

module.exports = Bird;
