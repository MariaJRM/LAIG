function Plane(scene, parts) {
       
        CGFobject.call(this,scene);

        this.parts=parts;
        
        
        this.initBuffers();
};
 
 Plane.prototype = Object.create(CGFobject.prototype);
 Plane.prototype.constructor = Plane;
 
 Plane.prototype.initBuffers = function() {
};
