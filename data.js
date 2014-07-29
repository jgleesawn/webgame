function Triangle() {
	this.VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	var vertices = [
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.VertexPositionBuffer.itemSize = 3;
	this.VertexPositionBuffer.numItems = 3;

	this.VertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	var colors = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.VertexColorBuffer.itemSize = 4;
	this.VertexColorBuffer.numItems = 3;
}

Triangle.prototype.Draw = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
			this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, triangle.VertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
			triangle.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, triangle.VertexPositionBuffer.numItems);
}


Triangle.prototype.Delete = function() {
	gl.deleteBuffer(this.VertexPositionBuffer);
	gl.deleteBuffer(this.VertexColorBuffer);
}








function Square() {
	this.VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	var vertices = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.VertexPositionBuffer.itemSize = 3;
	this.VertexPositionBuffer.numItems = 4;

	this.VertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	var colors = [];
	for (var i=0; i < 4; i++) {
		colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.VertexColorBuffer.itemSize = 4;
	this.VertexColorBuffer.numItems = 4;
}

Square.prototype.Draw = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
			this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.VertexPositionBuffer.numItems);
}

Square.prototype.Delete = function() {
	gl.deleteBuffer(this.VertexPositionBuffer);
	gl.deleteBuffer(this.VertexColorBuffer);
}



function Cube() {
	this.VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);

	//Generates Vertices
	//Generated Vertices do NOT line up with Indices used in gl.drawElements
	var vertices = []
	for( var i=0; i<6; i++) {
		var dimension = i%3;
		for( var j=0; j<4; j++) {
			var temp = []
			temp[dimension] = Math.pow(-1,Math.floor(i/3));
			var first = true
			for( var k=0; k<3; k++) {
				if ( k == dimension ) { continue }
				if ( first ) {
					temp[k] = Math.pow(-1,j%2);
					first = false;
				} else {
					temp[k] = Math.pow(-1,Math.floor(j/2));
				}
			}
			vertices = vertices.concat(temp);
		}
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.VertexPositionBuffer.itemSize = 3;
	this.VertexPositionBuffer.numItems = 24;
	
	
	this.VertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	var colors = [
		[1.0, 0.0, 0.0, 1.0],
		[1.0, 1.0, 0.0, 1.0],
		[0.0, 1.0, 0.0, 1.0],
		[1.0, 0.5, 0.5, 1.0],
		[1.0, 0.0, 1.0, 1.0],
		[0.0, 0.0, 1.0, 1.0],
	];
	var unpackedColors = [];
	for (var i in colors) {
		var color = colors[i];
		for (var j=0; j<4; j++) {
			unpackedColors = unpackedColors.concat(color);
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	this.VertexColorBuffer.itemSize = 4;
	this.VertexColorBuffer.numItems = 24;


	this.VertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
	var VertexIndices = [
		0, 1, 2,	0, 2, 3,
		4, 5, 6,	4, 6, 7,
		8, 9, 10,	8, 10, 11,
		12, 13, 14, 12, 14, 15,
		16, 17, 18, 16, 18, 19,
		20, 21, 22, 20, 22, 23
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(VertexIndices), gl.STATIC_DRAW);
	this.VertexIndexBuffer.itemSize = 1;
	this.VertexIndexBuffer.numItems = 36;
}

Cube.prototype.Draw = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Cube.prototype.Delete = function() {
	gl.deleteBuffer(this.VertexPositionBuffer);
	gl.deleteBuffer(this.VertexColorBuffer);
	gl.deleteBuffer(this.VertexIndexBuffer);
}





function Sphere(radius,numRings,numVertPerRing) {
	this.VertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	out = createSphereVertices(radius,numRings,numVertPerRing);
	var vertices = out[0];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.VertexPositionBuffer.itemSize = 3;
	this.VertexPositionBuffer.numItems = out[1];


	this.VertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	var colors = [];
	for (var i=0; i < out[1]; i++) {
		var step = 1/out[1];
		colors = colors.concat([1.0-i*step, i*step, Math.abs(1-2*i*step), 1.0]);
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.VertexColorBuffer.itemSize = 4;
	this.VertexColorBuffer.numItems = out[1];
}

Sphere.prototype.Draw = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
			this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
			this.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.VertexPositionBuffer.numItems);
}

Sphere.prototype.Delete = function() {
	gl.deleteBuffer(this.VertexPositionBuffer);
	gl.deleteBuffer(this.VertexColorBuffer);
}

//I added this.
//Centered on 0,0,0
function createSphereVertices(radius,numRings,vertPerRing) {
	var r = radius
	numRings = numRings+1;
	var phi   = Math.PI/numRings;
	var theta = 2*Math.PI/vertPerRing;
	var vertices = []
	for (var i = 0; i<numRings+1; i++) {  //Should include "ring" for top/bot points
		vertices.push([])
			for (var j = 0; j<vertPerRing; j++) {
				var y = r*Math.cos(i*phi)
				var x = r*Math.sin(i*phi)*Math.cos(j*theta);// + (i/2)*theta)
				var z = r*Math.sin(i*phi)*Math.sin(j*theta);// + (i/2)*theta)
				
				vertices[i].push([x,y,z])
			}
	}
	var triangle_strip = [];
	for (var i = 0; i<numRings; i++) {
		var li = vertices[i].length
		var li1 = vertices[i+1].length
		triangle_strip = triangle_strip.concat(vertices[i][li-1])
		triangle_strip = triangle_strip.concat(vertices[i+1][li1-1])
		for (var j = 0; j<vertPerRing; j++) {
			triangle_strip = triangle_strip.concat(vertices[i][j])
			triangle_strip = triangle_strip.concat(vertices[i+1][j])
		}
		triangle_strip = triangle_strip.concat(vertices[i][0])
		triangle_strip = triangle_strip.concat(vertices[i+1][0])
	}
	var numItems = triangle_strip.length/3	//based on 3-vector
	return [triangle_strip,numItems]
}

