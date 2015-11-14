function Patch(scene, order, partsU, partsV, c_points) {

	if(order > 1){
		var knots = createKnot(order);
	}

	var nurbsSurface = new CGFnurbsSurface(order, order, 
		knots, knots, 
				[	// U = 0 CONTROL POINTS (DEPENDE DO PARSER)
						[ // V = 0..1;
							 [-1.0, 0.0, 1.0, 1 ],
							 [-1.0,  0.0, -1.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 1.0, 0.0, 1.0, 1 ],
							 [ 1.0, 0.0, -1.0, 1 ]							 
						]
					]);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);

}

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor=Patch;

Patch.prototype.createKnot = function(order){

	var i = Math.pow((order+1),2);
	var knot = new Array(i);
	var middle = i/2;

	for(var j = 0; j < i-1;j++)
	{
		if(j < middle)
			knot[j] = 0;
		else
			knot[i] = 1;
	}

	return knot;

}