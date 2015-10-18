function Rectangle(scene, xt, yt, xb, yb) {

	CGFobject.call(this,scene);
	
	this.x1 = xt;
	this.y1 = yt;

	this.x2 = xb;
	this.y2 = yb;
	
	/*this.s = s || 1;		
	this.t = t || 1;*/

	this.initBuffers();

};


Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;

Rectangle.prototype.initBuffers = function () {
	this.vertices = [
		this.x1, this.y2, 0,
		this.x2, this.y2, 0,
		this.x1, this.y1, 0,
		this.x2, this.y1, 0
	];

	this.indices = [
		0, 1, 2, 
		3, 2, 1,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.normals = [
    	0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];
 	
	this.initGLBuffers();
	
};