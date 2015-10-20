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

    this.lenAC = Math.sqrt((this.tx3 - this.tx1) * (this.tx3 - this.tx1) 
        + (this.ty3 - this.ty1) * (this.ty3 - this.ty1) + (this.tz3 - this.tz1) * (this.tz3 - this.tz1));
    this.lenAB = Math.sqrt((this.tx2 - this.tx1) * (this.tx2 - this.tx1) 
        + (this.ty2 - this.ty1) * (this.ty2 - this.ty1) + (this.tz2 - this.tz1) * (this.tz2 - this.tz1));
    this.lenBC = Math.sqrt((this.tx3 - this.tx2) * (this.tx3 - this.tx2) 
        + (this.ty3 - this.ty2) * (this.ty3 - this.ty2) + (this.tz3 - this.tz2) * (this.tz3 - this.tz2));
    this.cos = (this.lenAC * this.lenAC - this.lenBC * this.lenBC + this.lenAB * this.lenAB) / (2 * this.lenAC * this.lenBC);
    this.sin = Math.sqrt(1 - this.cos * this.cos);

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
             this.lenAB/this.s, 0,
             (this.lenAB - this.lenBC * this.cos)/this.s, (this.lenAC * this.sin)/this.t ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Triangle.prototype.updateAmpl = function(s, t){
    this.texCoords = [
             0, 0,
             this.lenAB/s, 0,
             (this.lenAB - this.lenBC * this.cos)/s, (this.lenAC * this.sin)/t ];
};
