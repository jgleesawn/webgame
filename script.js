function webGLStart() {
	var canvas = document.getElementById("cid");
	initGL(canvas);
	initShaders();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1,100.0,pMatrix);
	loop();
	//drawScene();
}
var step = 0
function loop() {
	window.requestAnimationFrame(loop);
	drawScene();
	animate();

}
function animate() {
	mat4.translate(pMatrix, [0.0, 0.0, 0.02*Math.pow(-1,Math.floor(step/150))]);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix,[0.0,0.0,-12.0])
	mat4.rotateY(mvMatrix,Math.PI*step/60);
	step += 1
}


var triangle
var square
var spheres = [];
var cube

function initBuffers() {
	triangle = new Triangle();

	square = new Square();

	for( var i=0; i<20; i++){
		console.log(i)
		spheres.push(new Sphere(.3,20,20));
		spheres[i].pos = [Math.random()*6-3,Math.random()*6-3,Math.random()*(-7)+3.5];
	}
	//sphere = new Sphere(1,100,100);

	cube = new Cube()
}

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//Sets up perception, vertical field of 45degree, w/h ratio,visible 0.1<dist<100
	//mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1,100.0,pMatrix);


	mat4.translate(mvMatrix, [-1.5, 0.0, 0.0]);
	triangle.Draw()


	mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
	square.Draw()


	//I added this.
	for( i=0; i<spheres.length; i++){
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix,[0.0,0.0,-12.0])
		mat4.rotate(mvMatrix,-Math.PI*step/120,[0,1,0]);
		mat4.translate(mvMatrix, spheres[i].pos);
		spheres[i].Draw();
	}
	//mat4.translate(mvMatrix, [-1.5, 0.0, -2.0]);
	//sphere.Draw()
	//
	mat4.rotate(mvMatrix,Math.PI*step/60,[1,1,0]);
	cube.Draw()
}


//global gl for calling opengl functions.
var gl;
function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch(e) {
	}
	if(!gl) {
		alert("Could not initialise WebGL, sorry :(");
	}
}



var mvMatrix = mat4.create();	//Model-View Matrix
var pMatrix = mat4.create();	//Projection Matrix

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

var shaderProgram;
function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


