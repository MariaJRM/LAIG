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

    this.P0_2=Math.sqrt(Math.pow(this.x2-this.x0,2)+Math.pow(this.y2-this.y0,2)+Math.pow(this.z2-this.z0,2)); 
    this.P0_1=Math.sqrt(Math.pow(this.x1-this.x0,2)+Math.pow(this.y1-this.y0,2)+Math.pow(this.z1-this.z0,2));
    this.P1_2=Math.sqrt(Math.pow(this.x2-this.x1,2)+Math.pow(this.y2-this.y1,2)+Math.pow(this.z2-this.z1,2));
    
    this.cos = (Math.pow(this.P0_2,2)-Math.pow(this.P1_2,2)+Math.pow(this.P0_1,2))/(2*this.P0_2*this.P1_2);
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
                0, 0,
             this.P0_1/this.s, 0,
             (this.P0_1 - this.P1_2 * this.cos)/this.s, (this.P0_2 * this.sin)/this.t ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Triangle.prototype.updateAmpl = function(s, t){
    this.texCoords = [
             0, 0,
             this.P0_1/s, 0,
             (this.P0_1 - this.P1_2 * this.cos)/s, (this.P0_2 * this.sin)/t ];
    this.updateTexCoordsGLBuffers();
};
