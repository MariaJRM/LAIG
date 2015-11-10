function CircularAnimation(scene, center, radius, angle_init, angle_rot, time){
	
	Animation.call(this, scene, time);

	this.center = center;
	this.radius = radius;
	this.angle_init = angle_init;
	this.angle_rot = angle_rot;

}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;
CircularAnimation.prototype.init = function () {

};