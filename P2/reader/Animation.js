function Animation(scene, time){
	this.scene = scene;
	this.time = time;

	this.finished = false;
	this.matrix = mat4.create();
}

Animation.prototype.constructor = Animation;

Animation.prototype.getMatrix = function(){
	return this.matrix;
}