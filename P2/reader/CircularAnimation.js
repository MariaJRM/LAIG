function CircularAnimation(scene, center, radius, angle_init, angle_rot, time){
	
	Animation.call(this, scene, time);

	this.radius = radius;
	this.startang = angle_init;
	this.rotang = angle_rot;
	this.span = time;

	this.center = center.split(" ");

	this.tmatrix = mat4.create();
	this.initial = true;
	this.time = 0;
	this.currtime = 0;
	this.start = true;

	this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;
CircularAnimation.prototype.init = function () {

	this.finalAng = this.startang + this.rotang;
	this.speed = this.rotang/(this.span*1000);
	this.currentang = this.startang;
};

CircularAnimation.prototype.update = function (curtime) {

	if(this.currentang <= this.finalAng){

		if(this.initial){
			this.initial = false;
			this.time = curtime;
			this.currtime = curtime;
		}
		else{
			this.currtime = curtime;
		}
		this.currentang = this.startang + (this.speed * (this.currtime - this.time));
	}
	else{
		this.start = false;
	}

};

CircularAnimation.prototype.apply = function () {

	this.scene.translate(parseFloat(this.center[0]),
			parseFloat(this.center[1]),
			parseFloat(this.center[2]));
		//mat4.translate(matrix,matrix,[parseFloat(this.center[0]),
		//	parseFloat(this.center[1]),
		//	parseFloat(this.center[2])]);
		//mat4.rotate(matrix,matrix, (this.currentang*Math.PI)/180.0, [0,1,0]);
		this.scene.rotate((this.currentang*Math.PI)/180.0, 0,1,0);
		//mat4.translate(matrix, matrix,[this.radius,0,0]);

		this.scene.translate(this.radius,0,0);

		//return matrix;
}

