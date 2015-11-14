/**
 * Plane
 * @constructor
 */
function Plane(scene, parts) {

	CGFobject.call(this,scene);
	
	this.parts = parts;
	console.log(this.parts);
	
	var nurbsSurface = new CGFnurbsSurface(2, // degree on U: 3 control vertexes U
					3, // degree on V: 4 control vertexes on V
					[0, 0, 0, 1, 1, 1], // knots for U
					[0, 0, 0, 0, 1, 1, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..3;
							 [ -2.0, -2.0, 1.0, 1 ],
							 [ -2.0, -1.0, -2.0, 1 ],
							 [ -2.0, 1.0, 7.0, 1 ],
							 [ -2.0, 2.0, -1.0, 1 ]
						],
						// U = 1
						[ // V = 0..3
							 [ 0, -2.0, 0, 1 ],
							 [ 0, -1.0, -1.0, 5 ],
							 [ 0, 1.0, 1.5, 5 ],
							 [ 0, 2.0, 0, 1 ]
						],
						// U = 2
						[ // V = 0..3
							 [ 2.0, -2.0, -1.0, 1 ],
							 [ 2.0, -1.0, 2.0, 1 ],
							 [ 2.0, 1.0, -5.0, 1 ],
							 [ 2.0, 2.0, 1.0, 1 ]
						]
					], // translation of surface 
					[7.5,0,0]);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, this.parts, this.parts);

};


Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor=Plane;


Plane.prototype.display = function () {

	console.log("ENTRA AQUIIIIIIIIII");
	this.scene.pushMatrix();
		CGFnurbsObject.prototype.display.call(this);
	this.scene.popMatrix();
    /*this.appearance.apply();
	
	for (i =0; i<this.surfaces.length; i++) {
		this.pushMatrix();
	
		this.translate(this.translations[i][0], this.translations[i][1], this.translations[i][2]);

		this.surfaces[i].display();
		this.scene.rotate(-Math.PI/2, 1,0,0);
		this.popMatrix();
	}*/
};
