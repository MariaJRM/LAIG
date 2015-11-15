function Vehicle(scene) {

	CGFobject.call(this,scene);

	
	this.initBuffers();
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor=Vehicle;

Vehicle.prototype.display = function() {


}