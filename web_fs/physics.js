var orbitals = [
	[2],
	[2,6],
	[2,6],
	[2,10,6],
	[2,10,6],
	[2,10,6],
	];
var bondLength = [ 1.0, 0.7, 0.5, 0.3 ];
//Stops before the transition metals.
//Following periods have f-orbitals.
//Filling of orbitals varies more as the atomic number goes up.
/*
var orbitals = [
	2,
	2,6,
	2,6,
	2,10,6,
	2,10,6,
	2,10,6,
	];
*/
function Orbitals() {
	this.count = 0;
	this.cPeriod = 0;
	this.cOrbital = 0;
}
Orbitals.prototype.AddElectron = function() {
	this.count += 1;
	if (this.count >= orbitals[this.cPeriod][this.cOrbital]-1) {
		this.count = 0;
		this.cOrbital += 1;
		if ( this.cOrbital >= orbitals[this.cPeriod].length ) {
			this.cOrbital = 0;
			this.cPeriod += 1;
			if ( this.cPeriod >= orbitals.length ) {
				this.cPeriod -= 1;
				var end = orbitals[this.cPeriod].length-1;
				this.cOrbital = orbitals[this.cPeriod][end];
				this.count = orbitals[this.cPeriod][end];
				return false;
			}
		}
	}
	return true;
}
Orbitals.prototype.RemoveElectron = function() {
	this.count -= 1;
	if (this.count < 0) {
		this.cOrbital -= 1;
		if (this.currentOrbital < 0) {
			this.cPeriod -= 1;
			if ( this.cPeriod < 0 ) {
				this.cPeriod = 0;
				this.cOrbital = 0;
				this.count = 0;
				return false;
			}
			var l = orbitals[this.cPeriod].length;
			this.cOrbital = l-1;
		}
		this.count = orbitals[this.cPeriod][this.cOrbital];
	}
	return true;
}

//Treats all orbitals as hybridized.  Does not have de-hybridized interactions in the line of Oxygen and Flourine.
//Actually doesn't take into account the energy differences between sigma and pi bonds.
//returns Bond Order.  Analogous to bond strength.
function interact(atom1,atom2) {
	var orbital1 = atom1.orbital;
	var orbital2 = atom2.orbital;
	/*
	if (orbital1.cPeriod != orbital2.cPeriod) {
		return 0;
	}
	*/

	//Ionic transfer of electrons.
	//Using the difference in "orbital index" to signify electronegativity.
	var s1 = orbitals[orbital1.cPeriod][orbital1.cOrbital];
	var s2 = orbitals[orbital2.cPeriod][orbital2.cOrbital];
	if (s1 != s2) {
		var o_p1 = orbital1.cOrbital/orbitals[orbital1.cPeriod].length;
		var o_p2 = orbital2.cOrbital/orbitals[orbital2.cPeriod].length;
		if (o_p1 > o_p2) {
			while ( (orbital1.cOrbital != 0 && orbital1.count != 0) &&
					(orbital2.cOrbital != 0 && orbital2.count != 0 ) ) {
				atom1.negative += 1;
				orbital1.AddElectron();
				atom2.negative -= 1;
				orbital2.RemoveElectron();
				if (atom1.orbital.count != orbital1.count) { console.log("error.") }
			}
			return 0;
		} else if (o_p2 > o_p1) {
			while ( (orbital1.cOrbital != 0 && orbital1.count != 0) &&
					(orbital2.cOrbital != 0 && orbital2.count != 0 ) ) {
				atom2.negative += 1;
				orbital2.AddElectron();
				atom1.negative -= 1;
				orbital1.RemoveElectron();
				if (atom1.orbital.count != orbital1.count) { console.log("error.") }
			}
			return 0;
		}
	}

	var period = orbital1.cPeriod;
	if( orbital1.cPeriod < orbital2.cPeriod ) { period = orbital2.cPeriod; }
	
	var size = 0;
	for( var i=0; i<orbitals[period].length; i++) {
		size += orbitals[period][i];
	}
	//size = orbitals[orbital1.cPeriod][orbital1.cOrbital];
	var bonding;
	var antibonding;

	var t = orbital1.count + orbital2.count;
	if ( t > size/2 ) {
		bonding = size/2;
		antibonding = t-bonding;
	} else {
		bonding = t;
		antibonding = 0;
	}
	return (bonding-antibonding)/2;
}

function Atom(protons,electrons,position) {
	if (!protons) { protons = 0; }
	if (!electrons) { electrons = 0; }
	if (!position) { position = [0.0,0.0,0.0]; }
	this.positive = protons;
	this.negative = electrons;

	this.position = position;

	this.bonds = [];

	this.momentum = [0.0,0.0,0.0];

	this.orbital = new Orbitals();
	for (var i=0; i<electrons; i++) {
		this.orbital.AddElectron();
	}

	this.field = [0.0,0.0,0.0];

	this.visual = new Sphere(position,.1,10,10);
}

Atom.prototype.Draw = function() {
	//this.visual.UpdatePositionVertices(this.position);
	this.visual.Draw();
}

//Returns if it is in interaction range.
//Modifies field.
function updateForce(obj1,obj2) {
	var dir = vec3.create();
	vec3.subtract(obj2.position,obj1.position,dir);
	var l = vec3.length(dir);	//l == 1 -> object radius, starts interacting.
	if ( l < 1 ) { 
		return interact(obj1,obj2);
		//return interact(obj1.orbital,obj2.orbital);
	}

	//if ( l < 1 ) { interact(obj1,obj2); }

	var q1 = obj1.positive-obj1.negative;
	var q2 = obj2.positive-obj2.negative;

	vec3.normalize(dir);

//F 1->2
	var F12 = vec3.create();
	vec3.scale(dir,(q1*q2)/(l*l),F12);
//F 2->1
	var F21 = vec3.create();
	vec3.negate(F12,F21);

	vec3.add(obj1.field,F21);
	vec3.add(obj2.field,F12);
	return -1;
}

function Scope(radius) {
	this.atoms = [];
	this.position = vec3.create();
	this.radius = radius;
}

Scope.prototype.updateForce = function() {
	var bonds = [];
	for (var i=0; i<this.atoms.length; i++) {
		this.atoms[i].bonds = [];
		for ( var j=i+1; j< this.atoms.length; j++) {
			var v = updateForce(this.atoms[i],this.atoms[j]);
			if ( v <= 0 ) {	//v=0 is Ionic.
				this.atoms[i].bonds[j] = undefined;
				this.atoms[j].bonds[i] = undefined;
			} else {
				this.atoms[i].bonds[j] = v;
				this.atoms[j].bonds[i] = v;
			}
		}
	}

	
	//SlapDash Gravity between atoms.
	var v = vec3.create();
	for (var i=0; i<this.atoms.length; i++) {
		for (var j=i+1; j<this.atoms.length; j++) {
			var f = this.atoms[i].positive*2*this.atoms[j].positive*2;
			f *= 1/100000;
			vec3.direction(this.atoms[i].position,this.atoms[j].position,v);
			vec3.scale(v,f);
				
			vec3.add(this.atoms[j].field,v);
			vec3.negate(v);
			vec3.add(this.atoms[i].field,v);
		}
	}
	

	//Averages fields for bonded atoms, in order to maintain the bond.
	var fields = []
	for (var i=0; i<this.atoms.length; i++) {
		fields[i] = vec3.create();
		var l = 0;
		for (var j=0; j<this.atoms[i].bonds.length; j++) {
			if (this.atoms[i].bonds[j] == undefined) { continue }
			vec3.add(fields[i],this.atoms[j].field);
			l += 1;
		}
		vec3.add(fields[i],this.atoms[i].field);
		l += 1;
		vec3.scale(fields[i],1/l)
/*
		var temp = vec3.create();
		try {
			for (var j=0; j<bonds[i].length; j++){
				vec3.add(temp,bonds[i][j]);
			}
			vec3.scale(temp,bonds[i].length);
			vec3.set(this.atoms[i].field,temp);
		} catch(e) {}
*/
	}
	for (var i=0; i<this.atoms.length; i++) {
		vec3.set(this.atoms[i].field,fields[i]);
	}
}


Scope.prototype.applyForce = function() {
	for ( var i=0; i<this.atoms.length; i++) {
		var dist = vec3.create();
		var mass = this.atoms[i].positive*2;
		vec3.scale(this.atoms[i].field,1/(1000*mass),dist);
		vec3.add(this.atoms[i].position,dist);

		//l here defines the boundary of the scope.
		var l = vec3.length(this.atoms[i].position);
		if ( l > this.radius ) {
			for ( var j=0; j<this.atoms[i].bonds.length; j++) {
				if (this.atoms[i].bonds[j] == undefined) { continue }
				vec3.negate(this.atoms[j].position);
			}
			vec3.negate(this.atoms[i].position);
			vec3.add(this.atoms[i].position,dist);
		}
	}
}

Scope.prototype.applyGravity = function(coord) {
	for ( var i=0; i<this.atoms.length; i++) {
		var t = vec3.create();
		vec3.subtract(coord,this.atoms[i].position,t);
		var l = vec3.length(t);
		if ( l < 1 ) {
			vec3.normalize(t);
			vec3.scale(t,-1/(l*l*10));
			vec3.add(this.atoms[i].position,t);
		} else {
			vec3.normalize(t);
			vec3.scale(t,1/(l*l*10));
			vec3.add(this.atoms[i].position,t);
		}
	}
}

Scope.prototype.AddAtom = function(p,e,coord) {
	this.atoms.push(new Atom(p,e,coord));
}

Scope.prototype.InitVisual = function() {
	this.trianglestrips = [];
	cVertex = [
		1.0, 0.0, 0.0, 0.1,
		0.0, 1.0, 0.0, 0.1,
		0.0, 0.0, 1.0, 0.1,
		1.0, 1.0, 0.0, 0.1
	];
	for ( var i=0; i<this.atoms.length; i++) {
		this.trianglestrips.push(new Square([0.0,0.0,0.0]));
		this.trianglestrips[i].UpdateColorVertices(cVertex);
	}
}
Scope.prototype.Draw = function() {
	for ( var i=0; i<this.atoms.length; i++) {
		var v = [];
		var cVertex = [];
		var count = 1;
		v = v.concat(this.atoms[i].position);
		cVertex = cVertex.concat([0.0, 0.0, 1.0, 0.1]);
		for ( var j=0; j<this.atoms[i].bonds.length; j++) {
			if ( this.atoms[i].bonds[j] == undefined ) { continue }
			v = v.concat(this.atoms[j].position);
			var tvert = [0.0, 0.0, 0.0, 0.1];
			tvert[j%3] = 1.0;
			cVertex = cVertex.concat(tvert);
			count += 1;
		}
		if ( count > 2 ) {
			this.trianglestrips[i].UpdatePositionVertices(v,count);
			this.trianglestrips[i].UpdateColorVertices(cVertex);
			this.trianglestrips[i].Draw();
		}

		view.Draw(this.atoms[i]);
	}
}
