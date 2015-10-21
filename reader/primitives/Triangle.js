/**
 * Triangle
 * @constructor
 */
function Triangle(scene, x0, y0, z0, x1, y1, z1, x2, y2, z2, s, t){

	CGFobject.call(this,scene);

	this.x0 = x0;
	this.y0 = y0;
	this.z0 = z0;

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.s = s;
    this.t = t;

    this.AC=Math.sqrt(Math.pow(this.x2-this.x0,2)+Math.pow(this.y2-this.y0,2)+Math.pow(this.z2-this.z0,2)); 
    this.AB=Math.sqrt(Math.pow(this.x0-this.x1,2)+Math.pow(this.y0-this.y1,2)+Math.pow(this.z0-this.z1,2));
    this.BC=Math.sqrt(Math.pow(this.x1-this.x2,2)+Math.pow(this.y1-this.y2,2)+Math.pow(this.z1-this.z2,2));
    
    this.cos = (Math.pow(this.BC,2)-Math.pow(this.AB,2)+Math.pow(this.AC,2))/(2*this.BC*this.AC);
    this.sin = Math.sqrt(1-Math.pow(this.cos,2));

    this.initBuffers();

};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {

    this.vertices = [
    	this.x0, this.y0, this.z0,
    	this.x1, this.y1, this.z1,
    	this.x2, this.y2, this.z2
    ];

    this.indices = [
        0, 1, 2
    ];

    this.normals = [
    		0,0,1,
    		0,0,1,
    		0,0,1
    ];

    this.texCoords = [
        this.AC/this.s, 1/this.t,
        0, 1/this.t,
        (this.AC - this.BC * this.cos)/this.s,0,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/*
 * Method used to apply amplification values to textures on triangles.
 */
Triangle.prototype.updateAmpl = function(s, t){
    this.texCoords =[
        this.AC/this.s, 1/this.t,
        0, 1/this.t,
        (this.AC - this.BC * this.cos)/this.s,0,
        ];
    this.updateTexCoordsGLBuffers();
};
