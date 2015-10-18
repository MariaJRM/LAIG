function Triangle(scene, x0,y0,z0,x1,y1,z1,x2,y2,z2){

	CGFobject.call(this,scene);

	this.x0=x0;
	this.y0=y0;
	this.z0 = z0;

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

   /* this.s = s||1;
    this.t = t||1;*/

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

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    
};
