function LinearAnimation(scene, time, c_points){
	Animation.call(this, scene, time);
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;
LinearAnimation.prototype.init = function () {

};