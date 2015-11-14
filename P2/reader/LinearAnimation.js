function LinearAnimation(scene, time, c_points){
	
	Animation.call(this, scene, time);

	this.c_points = c_points;
	this.span = time;
	this.dist = 0;

	this.finished = false;
	this.startTime = 0;

	this.init();
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;
LinearAnimation.prototype.init = function () {

	//calcular dTotal
	this.directions = [];
	this.prevPoint=0;


	for(var i = 0; i < (this.c_points.length-1); i++){
		console.log(this.c_points[i]);
		var v = vec3.fromValues(
			this.c_points[i+1].xx - this.c_points[i].xx,
			this.c_points[i+1].yy - this.c_points[i].yy,
			this.c_points[i+1].zz - this.c_points[i].zz);

		console.log('v[' + i + ']=' + v);

		var distVec = Math.sqrt(Math.pow(v[0],2)+
			Math.pow(v[1],2)+
			Math.pow(v[2],2));

		console.log("DistVec = " + distVec);

		this.dist += distVec;

		console.log("Dist = " + this.dist);

		this.directions[i] = v;
	}

	console.log(this.directions);

	this.tranX = this.c_points[0].xx;
	console.log('TransX = '+this.tranX);
	this.tranY = this.c_points[0].yy;
	console.log('TransY = '+this.tranY);
	this.tranZ = this.c_points[0].zz;
	console.log('TransZ = '+this.tranZ);
	
	//console.log(this.directions);
	this.speed = this.dist/this.span;
	console.log("SPEED: " + this.speed);
	
}

LinearAnimation.prototype.update = function (curtime){

	console.log('PrevPoint: ' + this.prevPoint);
	if(this.prevPoint<(this.c_points.length-1) &&
		this.tranX==this.c_points[this.prevPoint+1].xx &&
		this.tranY==this.c_points[this.prevPoint+1].yy &&
		this.tranZ==this.c_points[this.prevPoint+1].zz)
	{
		console.log("IF 1");
		this.prevPoint++;
	}

	if(this.prevPoint == (this.c_points.length-1))
	{
		console.log("IF 3");
		this.finished = true;
	}

	if(!this.finished)
	{
		console.log("IF 2");
		var delta = (curtime - this.startTime)*0.001;
		//console.log(delta);
		this.startTime = curtime;
		var vel = (this.dist/this.span)*delta;
		//console.log(this.startTime);

			var d_norm = Math.sqrt(Math.pow(this.directions[this.prevPoint][0],2)
				+Math.pow(this.directions[this.prevPoint][1],2)
				+Math.pow(this.directions[this.prevPoint][2],2));
			//console.log(d_norm);
			if(d_norm != 0){
				this.directions[this.prevPoint][0] /= d_norm;
				this.directions[this.prevPoint][1] /= d_norm;
				this.directions[this.prevPoint][2] /= d_norm;
		}

		this.directions[this.prevPoint][0] *= vel;
		this.directions[this.prevPoint][1] *= vel;
		this.directions[this.prevPoint][2] *= vel;

		this.tranX +=this.directions[this.prevPoint][0];
		this.tranY +=this.directions[this.prevPoint][1];
		this.tranZ +=this.directions[this.prevPoint][2];

		if((this.directions[this.prevPoint][0] > 0 && this.tranX > this.c_points[this.prevPoint+1].xx) || (this.directions[this.prevPoint][0] < 0 && this.tranX < this.c_points[this.prevPoint+1].xx))
			this.tranX = this.c_points[this.prevPoint+1].xx;
		if((this.directions[this.prevPoint][1] > 0 && this.tranY > this.c_points[this.prevPoint+1].yy) || (this.directions[this.prevPoint][1] < 0 && this.tranY < this.c_points[this.prevPoint+1].yy))
			this.tranY = this.c_points[this.prevPoint+1].yy;
		if((this.directions[this.prevPoint][2] > 0 && this.tranZ > this.c_points[this.prevPoint+1].zz) || (this.directions[this.prevPoint][2] < 0 && this.tranZ < this.c_points[this.prevPoint+1].zz))
			this.tranZ = this.c_points[this.prevPoint+1].zz;

		var AB = vec2.fromValues(this.c_points[this.prevPoint+1].xx-this.c_points[this.prevPoint].xx,
			this.c_points[this.prevPoint+1].zz-this.c_points[this.prevPoint].zz);

		var BC = vec2.fromValues(0,1);

		this.rotAng = Math.acos(((AB[0]*BC[0])+(AB[1]*BC[1]))/
				(Math.sqrt(Math.pow(AB[0],2)+Math.pow(AB[1],2))+
				Math.sqrt(Math.pow(BC[0],2)+Math.pow(BC[1],2))))*(180/Math.PI);

				//console.log(rotAng); 
	
}
}

LinearAnimation.prototype.apply = function (){
	if(!this.finished){
	this.scene.translate(this.tranX, this.tranY, this.tranZ);
	this.scene.rotate(this.rotAng, 0, 1, 0);
	}
};


