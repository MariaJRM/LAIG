function LinearAnimation(scene, time, c_points){
	Animation.call(this, scene, time);

	this.c_points = c_points;
	this.time = time;
	this.dist = 0;

	this.start = true;

	this.init();
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;
LinearAnimation.prototype.init = function () {

	this.directions = [];

	for(var i = 0; i < this.c_points.length; i++){
		//vec3 v = vec3(this.c_points[i+1].xx-this.c_points[i].xx, 
		//	this.c_points[i+1].yy-this.c_points[i].yy,
		//	this.c_points[i+1].zz-this.c_points[i].zz);

		//console.log(v);
	}
	
}

LinearAnimation.prototype.update = function (curtime){

	//this.start = false;

}

LinearAnimation.prototype.apply = function (matrix){

	//return matrix;
}


