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

	this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;
CircularAnimation.prototype.init = function () {

	this.finalAng = this.startang + this.rotang;
	console.log("FINAL ANG: " + this.finalAng);
	this.speed = this.rotang/(this.span*1000);

	console.log("SPEED: " + this.speed);

	this.currentang = this.startang;


	mat4.identity(this.tmatrix);
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
		this.currentang = this.startang + this.speed * (this.currtime - this.time);
		console.log(this.currentang);	
	}
};

CircularAnimation.prototype.apply = function (nodematrix) {

		//console.log(nodematrix);

		mat4.identity(nodematrix);


		mat4.translate(nodematrix,nodematrix,parseFloat(this.center[0]),
			parseFloat(this.center[1]),
			parseFloat(this.center[2]));
	//	console.log(nodematrix);
		mat4.rotate(nodematrix,nodematrix, (this.currentang*Math.PI)/180.0, [0,1,0]);
	//	console.log(nodematrix);
		mat4.translate(nodematrix, nodematrix,this.radius,0,0);

		return nodematrix;
}

