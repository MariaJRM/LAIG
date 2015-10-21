function Interface () {
	CGFinterface.call(this);
}

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.ready = function(app){
	CGFinterface.prototype.init.call(this,app);

	this.gui = new dat.GUI();
	this.
	return true;
}

Interface.prototype.updateInterface = function(){
	if()
}