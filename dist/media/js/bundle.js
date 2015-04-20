!function e(t,i,n){function r(a,s){if(!i[a]){if(!t[a]){var d="function"==typeof require&&require;if(!s&&d)return d(a,!0);if(o)return o(a,!0);var h=new Error("Cannot find module '"+a+"'");throw h.code="MODULE_NOT_FOUND",h}var f=i[a]={exports:{}};t[a][0].call(f.exports,function(e){var i=t[a][1][e];return r(i?i:e)},f,f.exports,e,t,i,n)}return i[a].exports}for(var o="function"==typeof require&&require,a=0;a<n.length;a++)r(n[a]);return r}({1:[function(e,t,i){var n=e("./app-manager");new n},{"./app-manager":3}],2:[function(e,t,i){(function(i){function n(){this.animate=this.animate.bind(this),this.resizeEvent=this.resizeEvent.bind(this),this.mouseMoveEvent=this.mouseMoveEvent.bind(this),this.webGL=new o(window.innerWidth,window.innerHeight),document.body.appendChild(this.webGL.renderer.domElement),window.addEventListener("resize",this.resizeEvent),window.addEventListener("mousemove",this.mouseMoveEvent),this.animate();var e=new a;e.to(".tile__bar",.8,{width:"100%",onComplete:function(){var e=this.target[0];e.style.right=0,s.to(e,.3,{width:0,delay:.3})}}).from(".intro__container__group__bck",.6,{scale:window.innerHeight/document.getElementsByClassName("intro__container__group__bck")[0].offsetHeight}).to(".title span",.5,{opacity:1,y:0},"-=0.5").from(".border--l",.4,{height:0},"-=0.1").from(".border--t",.4,{width:0}).from(".border--r",.4,{height:0},"-=0.8").from(".border--b",.4,{width:0},"-=0.4").to(".intro__container__group",.4,{yPercent:-100,delay:1.6}).to(".border--l",.3,{height:0},"-=0.3").to(".border--t",.3,{width:0}).to(".border--r",.3,{height:0},"-=0.8").to(".border--b",.3,{width:0},"-=0.4")}var r=e("raf"),o=e("../webgl"),a="undefined"!=typeof window?window.TimelineMax:"undefined"!=typeof i?i.TimelineMax:null,s="undefined"!=typeof window?window.TweenMax:"undefined"!=typeof i?i.TweenMax:null;n.prototype.resizeEvent=function(){this.webGL.resize(window.innerWidth,window.innerHeight)},n.prototype.mouseMoveEvent=function(e){this.webGL.mouseMove(e.clientX,e.clientY)},n.prototype.animate=function(){r(this.animate),this.webGL.render()},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../webgl":7,raf:"raf"}],3:[function(e,t,i){t.exports=e("./AppManager")},{"./AppManager":2}],4:[function(e,t,i){(function(e){function i(){this.gravity=new n.Vector3(0,-.75,0),this.mesh=new n.Object3D,this.mesh.position.y=20,this.meshes=[];var e=new n.TorusKnotGeometry(160,80,40,8),t=n.ImageUtils.loadTexture("/media/img/bird-map.jpg");t.wrapS=t.wrapT=n.RepeatWrapping;var i=new n.Texture(this.generateTexture());i.needsUpdate=!0,i.wrapS=i.wrapT=n.RepeatWrapping;var r,o;for(r=0,o=18;o>r;r++){var a=new n.ShaderMaterial({uniforms:n.UniformsUtils.merge([n.UniformsLib.common,n.UniformsLib.bump,n.UniformsLib.normalmap,n.UniformsLib.lights,{map:{type:"t",value:null},hairMap:{type:"t",value:null},offset:{type:"f",value:r/o},time:{type:"f",value:0},speed:{type:"f",value:.025},gravity:{type:"v3",value:this.gravity}}]),vertexShader:["uniform float offset;","uniform vec3 gravity;","varying vec3 vNormal;","varying vec3 vViewPosition;",n.ShaderChunk.map_pars_vertex,n.ShaderChunk.lights_phong_pars_vertex,"void main() {",n.ShaderChunk.map_vertex,n.ShaderChunk.defaultnormal_vertex,"float displacementFactor = pow(offset, 1.0);","vec3 aNormal = transformedNormal;","aNormal.xyz += gravity * displacementFactor;","vec3 animated = position + (normalize(aNormal) * offset * 60.0);","vNormal = normalize(transformedNormal * aNormal);",n.ShaderChunk.default_vertex,"gl_Position = projectionMatrix * modelViewMatrix * vec4(animated, 1.0);","vViewPosition = -mvPosition.xyz;",n.ShaderChunk.lights_phong_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;","uniform vec3 emissive;","uniform vec3 specular;","uniform float shininess;","uniform float opacity;","uniform sampler2D hairMap;","uniform float offset;","uniform float time;","uniform float speed;",n.ShaderChunk.common,n.ShaderChunk.map_pars_fragment,n.ShaderChunk.lights_phong_pars_fragment,"void main() {","vec3 outgoingLight = vec3(0.0);","vec4 diffuseColor = vec4(diffuse, opacity);","vec2 uvTimeShift = vUv * vec2(5.0, 1.0) + vec2(-1.0, -0.3) * time * speed;","vec4 texelColor = texture2D(map, uvTimeShift);","diffuseColor *= texelColor;","vec2 uvTimeShiftHair = vUv * vec2(20.0, 2.0) + vec2(-1.0, -0.3) * time * speed;","vec4 hairColor = texture2D(hairMap, uvTimeShiftHair);","if (hairColor.r == 0.0 || hairColor.g < offset) {","discard;","}",n.ShaderChunk.specularmap_fragment,n.ShaderChunk.lights_phong_fragment,"gl_FragColor = vec4(outgoingLight, diffuseColor.a);","}"].join("\n"),lights:!0,transparent:!0});a.map=!0,a.uniforms.map.value=t,a.uniforms.hairMap.value=i;var s=new n.Mesh(e,a);this.meshes.push(s),this.mesh.add(s)}}var n="undefined"!=typeof window?window.THREE:"undefined"!=typeof e?e.THREE:null;i.prototype.generateTexture=function(){var e=document.createElement("canvas");e.width=e.height=256;for(var t=e.getContext("2d"),i=0;1e4>i;i++)t.fillStyle="rgb(255, "+Math.floor(255*Math.random())+", 0)",t.fillRect(Math.random()*e.width,Math.random()*e.height,4,4);return e},i.prototype.render=function(e){var t,i;for(t=0,i=this.meshes.length;i>t;t++)this.meshes[t].material.uniforms.time.value+=e},t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],5:[function(e,t,i){t.exports=e("./Bird")},{"./Bird":4}],6:[function(e,t,i){(function(i){function n(e,t){this.scene=new r.Scene,this.camera=new r.PerspectiveCamera(75,e/t,.1,1e3),this.currentX=0,this.camera.position.z=500,this.scene.add(this.camera),this.renderer=new r.WebGLRenderer({antialias:!0}),this.renderer.setSize(e,t),this.renderer.setClearColor(15461355);var i=new r.DirectionalLight(16777215,1);i.position.set(-.1,1,1),this.scene.add(i),this.mouseScreenX=0,this.bird=new o,this.scene.add(this.bird.mesh),this.clock=new r.Clock}var r="undefined"!=typeof window?window.THREE:"undefined"!=typeof i?i.THREE:null,o=e("../meshes/bird");n.prototype.resize=function(e,t){this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)},n.prototype.mouseMove=function(e){this.mouseScreenX=10*(e-window.innerWidth/2)*.01},n.prototype.render=function(){this.renderer.render(this.scene,this.camera);var e=this.clock.getDelta();this.camera.position.x+=.1*(this.mouseScreenX-this.camera.position.x),this.camera.lookAt(new r.Vector3(0,0,0)),this.bird.render(e)},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../meshes/bird":5}],7:[function(e,t,i){t.exports=e("./WebGL")},{"./WebGL":6}]},{},[1]);
//# sourceMappingURL=bundle.js.map