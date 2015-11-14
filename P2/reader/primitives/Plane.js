/**
 * Plane
 * @constructor
 */
function Plane(scene, parts) {
	
	var nurbsSurface = new CGFnurbsSurface(1, 1, 
		[0,0,1,1], [0,0,1,1], 
				[	// U = 0
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

	CGFnurbsObject.call(this, scene, getSurfacePoint, parts, parts);
};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor=Plane;
