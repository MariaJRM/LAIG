/**
 * Plane
 * @constructor
 */
function Plane(scene, parts) {

	CGFobject.call(this,scene);
	
	this.parts = parts;

	this.surfaces = [];
	
	this.makeSurface("0", 1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 [-0.5, -0.5, 0.0, 1 ],
							 [-0.5,  0.5, 0.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 0.5, -0.5, 0.0, 1 ],
							 [ 0.5,  0.5, 0.0, 1 ]							 
						]
					], // translation of surface 
					[-7.5,0,0]);
};


Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor=Plane;

Plane.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes, translation) {
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this, getSurfacePoint, this.parts, this.parts );
	this.surfaces.push(obj);	
	this.translations.push(translation);

}

/*
Plane.prototype.display = function () {
    this.scene.pushMatrix();
    this.appearance.apply();
    this.scene.rotate(-Math.PI/2, 1,0,0);
    this.surfaces.display();
    this.scene.popMatrix();
};*/
