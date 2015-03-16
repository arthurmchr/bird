var THREE = require('three');

function Bird() {

	this.gravity = new THREE.Vector3(0, -0.75, 0);
	this.mesh = new THREE.Object3D();
	this.meshes = [];

	var torusKnotGeo = new THREE.TorusKnotGeometry(160, 80, 160, 10);

	var mapTexture = THREE.ImageUtils.loadTexture('/media/img/11133-v4.jpg');
	mapTexture.wrapS = mapTexture.wrapT = THREE.RepeatWrapping;

	var furTexure = new THREE.Texture(this.generateTexture());
	furTexure.needsUpdate = true;
	furTexure.wrapS = furTexure.wrapT = THREE.RepeatWrapping;

	var i;
	var shells;

	for (i = 0, shells = 60; i < shells; i++) {

		var uniforms = {

			color: {
				type: 'c',
				value: new THREE.Color(0xffffff)
			},
			colorMap: {
				type: 't',
				value: mapTexture
			},
			hairMap: {
				type: 't',
				value: furTexure
			},
			offset:	{
				type: 'f',
				value: i / shells
			},
			time: {
				type: 'f',
				value: 0.0
			},
			gravity: {
				type: 'v3',
				value: this.gravity
			}
		};

		var material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: [
				'uniform float offset;',
				//'uniform float time;',
				//'uniform vec3 gravity;',

				'varying vec2 vUv;',
				'varying vec3 vNormal;',

				'void main() {',

					//'vec3 forceDirection = vec3(0.0, 0.0, 0.0);',

					// Wind

					//'forceDirection.x = sin(time + position.x * 0.05) * 0.2;',
					//'forceDirection.y = cos(time * 0.7 + position.y * 0.04) * 0.2;',
					//'forceDirection.z = sin(time * 0.7 + position.y * 0.04) * 0.2;',

					// Gravity

					//'vec3 displacement = gravity + forceDirection;',

					//'float displacementFactor = pow(offset, 3.0);',

					'vec3 aNormal = normal;',
					//'aNormal.xyz += displacement * displacementFactor;',

					// Move outwards depending on offset(layer) and normal + force + gravity

					'vec3 animated = position + (normalize(aNormal) * offset * 40.0);',

					'vNormal = normalize(normal * aNormal);',

					'vUv = uv;',

					'vec4 mvPosition = modelViewMatrix * vec4(animated, 1.0);',

					'gl_Position = projectionMatrix * mvPosition;',

				'}'
			].join('\n'),
			fragmentShader: [
				'uniform sampler2D colorMap;',
				'uniform sampler2D hairMap;',
				'uniform vec3 color;',
				'uniform float offset;',

				'varying vec3 vNormal;',
				'varying vec2 vUv;',

				'void main() {',

					'vec4 col = texture2D(colorMap, vUv);',
					'vec4 hairColor = texture2D(hairMap, vUv * vec2(20.0, 2.0));',

					// Discard no hairs + above the max length

					'if (hairColor.a <= 0.0 || hairColor.g < offset) {',
						'discard;',
					'}',

					// Darker towards bottom of the hair

					'float shadow = mix(0.0, hairColor.b * 1.2, offset);',

					// Light

					'vec3 light = vec3(0.1, 1.0, 0.3);',
					'float d = pow(max(0.25, dot(vNormal.xyz, light)) * 2.75, 1.4);',

					'gl_FragColor = vec4(color * col.xyz * d * shadow, 1.1 - offset);',
					//'gl_FragColor = hairColor;',

				'}'
			].join('\n'),

			transparent: true
		});

		var newMesh = new THREE.Mesh(torusKnotGeo, material);
		this.meshes.push(newMesh);
		this.mesh.add(newMesh);
	}
}

Bird.prototype.generateTexture = function() {
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = 256;

	var ctx = canvas.getContext('2d');

	for (var i = 0; i < 20000; i++) {
		ctx.fillStyle = 'rgb(255, ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')';

		ctx.fillRect((Math.random() * canvas.width), (Math.random() * canvas.height), 2, 2);
	}

	return canvas;
};

Bird.prototype.render = function(delta) {
	//var optimalDivider = delta / 16;
	//var smoothing = Math.max(4, (20 / optimalDivider));

	// fake some gravity according to mouse movement

	//var xf = (mouse.x - mouseObj.x)/(smoothing*5);
	//var yf = (mouse.y - mouseObj.y)/(smoothing*5);

	// mouseObj.vx += xf
	// mouseObj.vy += yf;
	// mouseObj.vx *= 0.96;
	// mouseObj.vy *= 0.94;
	// mouseObj.x += mouseObj.vx;
	// mouseObj.y += mouseObj.vy;

	//gravity.x = -(mouse.x-mouseObj.x)*2;

	//var dif = Math.sin(mouse.x)*150 - camera.position.x;
	//gravity.y = -0.75 + (Math.abs(dif)/150) - (mouse.y-mouseObj.y)*2;

	// camera.position.x += (Math.sin(mouse.x)*150 - camera.position.x)/smoothing;
	// camera.position.z += (Math.cos(mouse.x)*150 - camera.position.z)/smoothing;
	// camera.position.y += (Math.sin(mouse.y)*150 - camera.position.y)/smoothing;

	//camera.lookAt(scene.position);

	//shaderTime += delta*0.005;

	var i;
	var ln;

	for (i = 0, ln = this.meshes.length; i < ln; i++) {
		this.meshes[i].material.uniforms.time.value = delta;
	}
};

module.exports = Bird;
