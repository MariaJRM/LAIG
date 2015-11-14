function Patch(scene, order, partsU, partsV, c_points) {

	CGFobject.call(this, scene);

	this.knots = createKnot(order);
	this.partsU = partsU;
	this.partsV = partsV;
	this.order = order;
	this.controlVertexes = [];


     this.surfaces = [];
   	 this.translations = [];

	// É preciso otimizar isto!!! 
	if(order == 1){
		this.controlVertexes[0] = [c_points[0],c_points[1]];
		this.controlVertexes[1] = [c_points[2],c_points[3]];
	}
	else if(order == 2)
	{
		this.controlVertexes[0] = [c_points[0],c_points[1], c_points[2]];
		this.controlVertexes[1] = [c_points[3],c_points[4], c_points[5]];
		this.controlVertexes[2] = [c_points[6],c_points[7], c_points[8]];
	}
	else if(order == 3){
	
		this.controlVertexes[0] = [c_points[0],c_points[1], c_points[2] , c_points[3]];
			//console.log(controlVertexes[0]);
		this.controlVertexes[1] = [c_points[4],c_points[5], c_points[6], c_points[7]];
		this.controlVertexes[2] = [c_points[8],c_points[9], c_points[10] , c_points[11]];
		this.controlVertexes[3] = [c_points[12],c_points[13], c_points[14], c_points[15]];
	}

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
