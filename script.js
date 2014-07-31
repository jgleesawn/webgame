var view
function webGLStart() {
	var canvas = document.getElementById("cid");
	initGL(canvas);
	initShaders();
	initBuffers();

	view = new View();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	//mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1,100.0,pMatrix);

	loop();
	//drawScene();
}
function loop() {
	window.requestAnimationFrame(loop);
	drawScene();
	animate();

}
function animate() {
	//mat4.translate(pMatrix, [0.0, 0.0, 0.02*Math.pow(-1,Math.floor(step/150))]);
	/*
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix,[0.0,0.0,-12.0])
	mat4.rotateY(mvMatrix,Math.PI*step/60);
	step += 1;
	*/

	view.Set();

}


var triangle
var square
var spheres = [];
var cube

function initBuffers() {
	triangle = new Triangle([-1.5,0.0,0.0]);

	square = new Square([1.5,0.0,0.0]);

	spheres = [];
	for( var i=0; i<20; i++){
		var pos = [Math.random()*6-3,Math.random()*6-3,-12.0 + Math.random()*(-7)+3.5];
		spheres.push(new Sphere(pos,.3,20,20));
		//spheres[i].pos = [Math.random()*6-3,Math.random()*6-3,Math.random()*(-7)+3.5];
	}
	//sphere = new Sphere(1,100,100);

	cube = new Cube([0.0,0.0,0.0])
}

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//Sets up perception, vertical field of 45degree, w/h ratio,visible 0.1<dist<100
	//mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1,100.0,pMatrix);

	//mat4.identity(mvMatrix);


	//mat4.translate(mvMatrix, [-1.5, 0.0, 0.0]);
	//triangle.Draw()
	view.Draw(triangle);


	//mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
	//square.Draw()
	view.Draw(square);


	//I added this.
	for( i=0; i<spheres.length; i++){
	//	mat4.identity(mvMatrix);
	//	mat4.translate(mvMatrix,[0.0,0.0,-12.0])
	//	mat4.rotate(mvMatrix,-Math.PI*step/120,[0,1,0]);
	//	mat4.translate(mvMatrix, spheres[i].pos);
	//	spheres[i].Draw();
		view.Draw(spheres[i]);
	}
	//mat4.translate(mvMatrix, [-1.5, 0.0, -2.0]);
	//sphere.Draw()
	//
//	mat4.rotate(mvMatrix,Math.PI*step/60,[1,1,0]);
//	cube.Draw()
	view.Draw(cube);

	view.Draw();
}


