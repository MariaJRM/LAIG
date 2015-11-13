function LinearAnimation(scene, time, c_points){
	
	Animation.call(this, scene, time);

	this.c_points = c_points;
	this.span = time;
	this.dist = 0;

	this.start = true;
	this.startTime = 0;

	this.init();
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;
LinearAnimation.prototype.init = function () {

	//calcular dTotal
	this.directions = [];
	this.prevPoint=0;

	for(var i = 1; i < this.c_points.length; i++){
		var v = vec3.fromValues(
			this.c_points[i].xx - this.c_points[i-1].xx,
			this.c_points[i].yy - this.c_points[i-1].yy,
			this.c_points[i].zz - this.c_points[i-1].zz);

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
		this.tranX==this.c_points[this.prevPoint].xx &&
		this.tranY==this.c_points[this.prevPoint].yy &&
		this.tranZ==this.c_points[this.prevPoint].zz)
	{
		this.prevPoint++;
	}

	if(this.prevPoint == (this.c_points.length-1))
	{
		this.start = false;
	}

	if(this.start)
	{
		var delta = (curtime - this.startTime)*0.001;
		//console.log(delta);
		this.startTime = curtime;
		//console.log(this.startTime);

		for(var i = 1; i < this.directions.length; i++){
			//console.log(this.directions[i][0]);
			var d_norm = Math.sqrt(Math.pow(this.directions[i][0],2)
				+Math.pow(this.directions[i][1],2)
				+Math.pow(this.directions[i][2],2));
			//console.log(d_norm);
			if(d_norm != 0){
				this.directions[i][0] /= d_norm;
				this.directions[i][1] /= d_norm;
				this.directions[i][2] /= d_norm;
			}
		}

		var vel = (this.dist/this.span)*delta;
//--------- NEEDS TO BE END
	/*	this.directions[i][0] *= vel;
		this.directions[i][1] *= vel;
		this.directions[i][2] *= vel;

		this.tranX +=this.directions[i][0];
		this.tranY +=this.directions[i][1];
		this.tranZ +=this.directions[i][2];

		if((this.directions[i][0] > 0 && this.tranX > this.c_points[this.prevPoint+1].xx) || (this.directions[i][0] < 0 && this.tranX < this.c_points[this.prevPoint+1].xx))
			this.tranX = this.c_points[this.prevPoint+1].xx;
		if((this.directions[i][1] > 0 && this.tranY > this.c_points[this.prevPoint+1].yy) || (this.directions[i][1] < 0 && this.tranY < this.c_points[this.prevPoint+1].yy))
			this.tranY = this.c_points[this.prevPoint+1].yy;
		if((this.directions[i][2] > 0 && this.tranZ > this.c_points[this.prevPoint+1].zz) || (this.directions[i][2] < 0 && this.tranZ < this.c_points[this.prevPoint+1].zz))
			this.tranZ = this.c_points[this.prevPoint+1].zz;*/
//--------------
		// rotation

		var AB = vec2.fromValues(this.c_points[this.prevPoint+1].xx-this.c_points[this.prevPoint].xx,
			this.c_points[this.prevPoint+1].zz-this.c_points[this.prevPoint].zz);

		var BC = vec2.fromValues(0,1);

		var rotAng = Math.acos(((AB[0]*BC[0])+(AB[1]*BC[1]))/
				(Math.sqrt(Math.pow(AB[0],2)+Math.pow(AB[1],2))+
				Math.sqrt(Math.pow(BC[0],2)+Math.pow(BC[1],2))))*(180/Math.PI);

				//console.log(rotAng); 
	}
}

LinearAnimation.prototype.apply = function (){
	//this.scene.translate(this.vx, this.vy, this.vz);
	//this.scene.rotate(rot, 0, 1, 0);
}


