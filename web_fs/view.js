function View() {
	this.position = vec3.create();
	this.position[2] = 36.0;
	this.focalPoint = vec3.create();
	this.focalPoint[2] = -1.0;
	this.up = vec3.create();
	this.up[1] = 1.0;

	this.cross = vec3.create();
	vec3.cross(this.focalPoint,this.up,this.cross);

	this.B = mat4.create();
	this.UpdateBasis();

	
	this.direction = [0,0];

	this.aim = new Triangle([0.0,0.0,0.0]);
	var vertices = [
		0.0, 0.0005, 0.0,
		-0.0005, -0.0005, 0.0,
		0.0005, -0.0005, 0.0
	];
	this.aim.UpdatePositionVertices(vertices);
}
View.prototype.UpdateBasis = function() {
	this.B[0] = this.cross[0];
	this.B[1] = this.up[0]; 
	this.B[2] = this.focalPoint[0]; 
	this.B[3] = 0;
	this.B[4] = this.cross[1]; 
	this.B[5] = this.up[1];
	this.B[6] = this.focalPoint[1]; 
	this.B[7] = 0;
	this.B[8] = this.cross[2]; 
	this.B[9] = this.up[2]; 
	this.B[10] = this.focalPoint[2];
	this.B[11] = 0;
	this.B[12] = 0;
	this.B[13] = 0;
	this.B[14] = 0;
	this.B[15] = 1;
}
View.prototype.ZoomIn = function() {
	vec3.normalize(this.focalPoint);
	var out = vec3.create();
	out = this.focalPoint;
	mat4.translate(this.B,out);
}
View.prototype.ZoomOut = function() {
	vec3.normalize(this.focalPoint);
	var out = vec3.create();
	vec3.negate(this.focalPoint,out);
	mat4.translate(this.B,out);
}
View.prototype.ScrollUp = function() {
	var out = vec3.create();
	vec3.negate(this.up,out);
	mat4.translate(this.B,out);
}
View.prototype.ScrollDown = function() {
	mat4.translate(this.B,this.up);
}
View.prototype.ScrollLeft = function() {
	mat4.translate(this.B,this.cross);
	
	
}
View.prototype.ScrollRight = function() {
	var out = vec3.create();
	vec3.negate(this.cross,out);
	mat4.translate(this.B,out);
}

function Cart2Sphere(x,y,z) {
	var theta = Math.atan2(x,y);
	var xydist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	var phi = Math.atan2(xydist,z);
	return theta,phi;
}
//theta is angle on XY-plane,phi is angle removed from XY-plane
//Returns unit vector.
function Sphere2Cart(theta,phi) {
	var z = Math.sin(phi);
	var y = Math.sin(theta)*Math.cos(phi);
	var x = Math.cos(theta)*Math.cos(phi);
	return [x,y,z];
}

//Check Rotation Matrices.
//theta=0,phi
View.prototype.Yaw = function(angle) {	//Look Left/Right
	//ZX-plane

	//angle = -angle;
	var rotm = [
		Math.cos(angle),0.0,-Math.sin(angle),0.0,
		0.0,1.0,0.0,0.0,
		Math.sin(angle),0.0,Math.cos(angle),0.0,
		0.0,0.0,0.0,1.0
		];

	mat4.multiply(rotm,this.B,this.B);
	this.focalPoint[0] = this.B[2];
	this.focalPoint[1] = this.B[6];
	this.focalPoint[2] = this.B[10];
	
	this.cross[0] = this.B[0];
	this.cross[1] = this.B[4];
	this.cross[2] = this.B[8];

}
//theta=PI/2,phi
View.prototype.Pitch = function(angle) {	
	//ZY-plane
	var rotm = [
		1.0,0.0,0.0,0.0,
		0.0,Math.cos(angle),Math.sin(angle),0.0,
		0.0,-Math.sin(angle),Math.cos(angle),0.0,
		0.0,0.0,0.0,1.0
		];

	mat4.multiply(rotm,this.B,this.B);
	this.focalPoint[0] = this.B[2];
	this.focalPoint[1] = this.B[6];
	this.focalPoint[2] = this.B[10];

	this.up[0] = this.B[1];
	this.up[1] = this.B[5];
	this.up[2] = this.B[9];

}

View.prototype.Set = function() {
	mat4.identity(pMatrix);
	mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1,100.0,pMatrix);
}

View.prototype.Draw = function(obj) {
	if (!obj) {
		mat4.identity(cMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix,[0.0,0.0,-0.1]);
		this.aim.Draw();
		return;
	}


	mat4.identity(cMatrix);
	mat4.multiply(cMatrix,this.B);
	mat4.translate(cMatrix, this.position);

	var position = vec3.create();
	position[0] = this.B[12];
	position[1] = this.B[13];
	position[2] = this.B[14];
	mat4.identity(mvMatrix);
	
	mat4.multiply(mvMatrix,this.B);

	if(obj.position == undefined) { console.log("undefined") }
	mat4.translate(mvMatrix, obj.position);	//Most Recent.

	obj.Draw();
}




