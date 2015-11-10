/**
 * Rectangle
 * @constructor
 */
function Rectangle(scene, x1, y1, x2, y2, s , t) {

	CGFobject.call(this,scene);
	
	this.x1 = x1;
	this.y1 = y1;

	this.x2 = x2;
	this.y2 = y2;

	this.s = s;
	this.t = t;

	if(this.x2 < 0)
		this.lenX = -x2 - x1;
	else 
		this.lenX = x2 - x1;

	if(this.y1 < 0) 
		this.lenY = -y1 - y2;
	else 
		this.lenY = y1 - y2;

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

    this.texCoords = [    
    	0, this.lenY/this.t,
    	this.lenX/this.s,this.lenY/this.t,
    	0, 0,
    	this.lenX/this.s, 0
		];
 	
	this.initGLBuffers();
	
};

/*
 * Method used to apply amplification values to textures on rectangles
 */
Rectangle.prototype.updateAmpl = function(s,t){
	this.texCoords = [    
		0, this.lenY/t,
		this.lenX/s,this.lenY/t,
		0, 0,
		this.lenX/s, 0
		];
	this.updateTexCoordsGLBuffers();
};