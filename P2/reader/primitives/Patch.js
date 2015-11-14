function Patch(scene, order, partsU, partsV, c_points) {
	CGFobject.call(this,scene);

}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor=Patch;