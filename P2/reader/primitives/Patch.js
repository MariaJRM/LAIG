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

function Patch(scene, order, partsU, partsV, c_points) {

	if(order > 0 && order < 4){
		var knots = createKnot(order);
		console.log(knots);
	}

	var controlVertexes = [];

	// É preciso otimizar isto!!! Está a rebentar porque isto está mal feito eheheheh
	if(order == 1){
		controlVertexes[0] = [c_points[0],c_points[1]];
		controlVertexes[1] = [c_points[2],c_points[3]];
	}
	else if(order == 2)
	{
		controlVertexes[0] = [c_points[0],c_points[1], c_points[2]];
		controlVertexes[1] = [c_points[3],c_points[4], c_points[5]];
		controlVertexes[2] = [c_points[6],c_points[7], c_points[8]];
	}
	else if(order == 3){
	
		controlVertexes[0] = [c_points[0],c_points[1], c_points[2] , c_points[3]];
			console.log(controlVertexes[0]);
		controlVertexes[1] = [c_points[4],c_points[5], c_points[6], c_points[7]];
		controlVertexes[2] = [c_points[8],c_points[9], c_points[10] , c_points[11]];
		controlVertexes[3] = [c_points[12],c_points[13], c_points[14], c_points[15]];
	}

	console.log(controlVertexes);

	console.log(order);
	console.log(knots);

	var nurbsSurface = new CGFnurbsSurface(order, order, 
		knots, knots, controlVertexes);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);

}

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor=Patch;
