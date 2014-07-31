function View() {
	this.coord = vec3.create();//[0.0,0.0,12.0];//x,y,z
	this.coord[2] = 36.0;
	this.focalPoint = vec3.create();
	this.focalPoint[2] = -1.0;
	this.up = vec3.create();
	this.up[1] = 1.0;

	this.cross = vec3.create();
	vec3.cross(this.focalPoint,this.up,this.cross);

	this.B = mat4.create();
	this.UpdateBasis();
	
	//cross 0-3
	//up	4-7
	//fp	8-11
	//

	this.direction = [0,0];

	this.aim = new Triangle([0.0,0.0,0.0],0.0005);
}
View.prototype.UpdateBasis = function() {
	this.B[0] = this.cross[0];
	this.B[1] = this.up[0]; //this.cross[1];
	this.B[2] = this.focalPoint[0]; //this.cross[2];
	this.B[3] = 0;
	this.B[4] = this.cross[1]; //this.up[0];
	this.B[5] = this.up[1];
	this.B[6] = this.focalPoint[1]; //this.up[2];
	this.B[7] = 0;
	this.B[8] = this.cross[2]; //this.focalPoint[0];
	this.B[9] = this.up[2]; //this.focalPoint[1];
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
	// out = vec3.scale(out,1.0);
	//vec3.negate(this.focalPoint,out);
	mat4.translate(this.B,out);//[0,0,-1]);
	//vec3.add(this.coord,out);
	//this.coord[2] -= 1.0;
}
View.prototype.ZoomOut = function() {
	vec3.normalize(this.focalPoint);
	var out = vec3.create();
	vec3.negate(this.focalPoint,out);
	// var out = vec3.scale(out,1.0);
	mat4.translate(this.B,out);//[0,0,1]);
	//vec3.subtract(this.coord,out);
	//this.coord[2] += 1.0;
}
View.prototype.ScrollUp = function() {
	//var cart = Sphere2Cart(Math.PI/2,this.direction[0]);
	//console.log(this.coord)
	var out = vec3.create();
	vec3.negate(this.up,out);
	mat4.translate(this.B,out);//[0,-1,0]);
	//vec3.subtract(this.coord,this.up,this.coord);
	//this.coord[1] -= 1.0;
}
View.prototype.ScrollDown = function() {
	//var cart = Sphere2Cart(Math.PI/2,this.direction[0]);
	mat4.translate(this.B,this.up);//[0,1,0]);
	//vec3.add(this.coord,this.up,this.coord);

	//this.coord[1] += 1.0;
}
View.prototype.ScrollLeft = function() {
	mat4.translate(this.B,this.cross);//[1,0,0]);
	//vec3.add(this.coord,this.cross);//cart);
	//this.coord[0] += 1.0;
}
View.prototype.ScrollRight = function() {
	var out = vec3.create();
	vec3.negate(this.cross,out);
	mat4.translate(this.B,out);//[-1,0,0]);
	//vec3.subtract(this.coord,this.cross);//cart);
	//this.coord[0] -= 1.0;
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

	//var Brotm = mat4.create();

	//mat4.multiply(B,rotm,Brotm);
/*	console.log("fp",this.focalPoint);
	console.log("up",this.up);
	console.log("cross",cross);
	console.log("B",B);
	console.log(rotm);
	*/
	//console.log(Brotm);
	mat4.multiply(rotm,this.B,this.B);
	this.focalPoint[0] = this.B[2];
	this.focalPoint[1] = this.B[6];
	this.focalPoint[2] = this.B[10];
	//this.focalPoint[3] = B[11];
	this.cross[0] = this.B[0];
	this.cross[1] = this.B[4];
	this.cross[2] = this.B[8];
	//this.cross[3] = this.B[3];

/*	
	this.direction[1] += angle;
	if (this.direction[1] > Math.PI*2) {
		this.direction[1] -= Math.PI*2;
	} else if (this.direction[1] < -Math.PI*2) {
		this.direction[1] += Math.PI*2;
	}
	*/
}
//theta=PI/2,phi
View.prototype.Pitch = function(angle) {	//Look Up/Down
	//ZY-plane
	//var cross = vec3.create();
	//vec3.cross(this.focalPoint,this.up,cross);

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
	//this.focalPoint[3] = B[11];
	this.up[0] = this.B[1];
	this.up[1] = this.B[5];
	this.up[2] = this.B[9];
	//this.up[3] = B[7];


/*	
	this.direction[0] += angle;
	if (this.direction[0] > Math.PI*2) {
		this.direction[0] -= Math.PI*2;
	} else if (this.direction[0] < -Math.PI*2) {
		this.direction[0] += Math.PI*2;
	}
	*/
}

View.prototype.Set = function() {
	mat4.identity(pMatrix);

//	var eye = vec3.create();
//	var center = vec3.create();
//	var up = vec3.create();
//	vec3.add(this.coord,vec3.create(),eye);
//	vec3.add(this.coord,this.focalPoint,center);
//	vec3.add(this.coord,this.up,up);

//New gl-matrix, pMatrix is first argument.	
	//mat4.lookAt(eye,center,up,pMatrix);
/*	
	mat4.lookAt(vec3.create(),this.focalPoint,this.up,pMatrix);

	var fovy = Math.PI/4;
	var aspect = gl.viewportWidth/gl.viewportHeight;
	var near = 0.1;
	var far = 100.0;

	var f = 1.0 / Math.tan( fovy/2 );	
	var nf = 1 / (near - far);

	//mat4.identity(pMatrix);
	pMatrix[0] = f / aspect;
	pMatrix[5] = f;
	pMatrix[10] = (far + near) * nf;
	pMatrix[11] = -1;
	pMatrix[14] = (2*far*near) * nf;
	pMatrix[15] = 1;
*/
	mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1,100.0,pMatrix);
	//mat4.translate(pMatrix,this.coord);
}

View.prototype.Draw = function(obj) {
	if (!obj) {
		mat4.identity(cMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix,[0.0,0.0,-0.1]);
		this.aim.Draw();
		return;
	}
//	var cross = vec3.create();
//	vec3.cross(this.focalPoint,this.up,cross);
//	vec3.normalize(cross);

	mat4.identity(cMatrix);
	mat4.multiply(cMatrix,this.B);
	mat4.translate(cMatrix, this.coord);

	var coord = vec3.create();
	coord[0] = this.B[12];
	coord[1] = this.B[13];
	coord[2] = this.B[14];
	mat4.identity(mvMatrix);
	
//	mat4.translate(mvMatrix, obj.coord);
	
	mat4.multiply(mvMatrix,this.B);
//	mat4.translate(mvMatrix, coord);

	/*
	var direction = mat3.create();
	mat4.toMat3(this.B,direction);
	var out = mat4.create();
	mat3.toMat4(direction, out);

	vec3.add(coord, obj.coord);
	out[12] = coord[0];
	out[13] = coord[1];
	out[14] = coord[2];

	mat4.multiply(mvMatrix,out);
*/

	//mat4.translate(mvMatrix, this.coord);
	//mat4.translate(mvMatrix, obj.coord);
	//mvMatrix[15] = 0;
	
	mat4.translate(mvMatrix, obj.coord);	//Most Recent.

	//mat4.multiply(mvMatrix,obj.position);
	//mat4.rotate(mvMatrix,this.direction[0],[1,0,0]);
	//mat4.rotate(mvMatrix,this.direction[1],[0,1,0]);
	//mat4.multiply(mvMatrix,obj.position);

	//mat4.translate(mvMatrix, this.coord);

	//obj.coord[0];	//X
	//obj.coord[1];	//Y
	//obj.coord[2];	//Z
	//obj
	obj.Draw();
}












