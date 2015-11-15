function Patch(scene, order, partsU, partsV, c_points) {

	CGFobject.call(this, scene);

	this.knots = createKnot(order);
	this.partsU = partsU;
	this.partsV = partsV;
	this.order = order;
	this.controlVertexes = createMatrixCV(order, c_points);

	this.initBuffers();
}


Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor=Patch;

Patch.prototype.initBuffers = function() {

	 this.makeSurface(this.order, 
					 this.order, 
					this.knots,
					this.knots, 
					this.controlVertexes);

}

Patch.prototype.makeSurface = function (degree1, degree2, knots1, knots2, controlvertexes) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
	
	this.nurbObj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU,this.partsV) ;
};

Patch.prototype.display = function() {
	this.nurbObj.display();
};

function createKnot(order){
	var i = order+1;
	var knot = new Array(i);
	var n = i*2;

	for(var j = 0; j < n;j++)
	{
		if(j < i)
			knot[j] = 0;
		else
			knot[j] = 1;
	}
	return knot;
}

function createMatrixCV(order, c_points){

	var n = order+1;
	var CV = [];
	var index = 0;

	for(var i = 0; i < n; i++)
	{
		var temp = [];
		for(var j = 0; j < n; j++)
		{
			temp[j] = c_points[index];
			index++;
		}
		CV[i] = temp;
	}

	return CV;

}
