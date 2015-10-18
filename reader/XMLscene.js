
function convertDegtoRad(deg){
	return (deg*Math.PI/180.0);
} 

function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.axis=new CGFaxis(this);

   // this.rect = new Rectangle(this, 0,1,1,0);
   // this.cyl = new Cylinder(this,1,convertDegtoRad(360),convertDegtoRad(360),40,40);
    //this.tri = new Triangle(this, 0,0,0,0.5,1,0,1,0,0);
    this.sp = new Sphere(this,convertDegtoRad(360),20,20);

	
};



XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), 
    	vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

XMLscene.prototype.processLights = function(){
	
	var i = 0;
    for(light in this.graph.lightsInfo){
    	var temp_id = this.graph.lightsInfo[light].id;

    	this.lights[i].setPosition(this.graph.lightsInfo[light].position.x, this.graph.lightsInfo[light].position.y, this.graph.lightsInfo[light].position.z, this.graph.lightsInfo[light].position.w);
    	this.lights[i].setDiffuse(this.graph.lightsInfo[light].diffuse.r, this.graph.lightsInfo[light].diffuse.g, this.graph.lightsInfo[light].diffuse.b, this.graph.lightsInfo[light].diffuse.a);
    	this.lights[i].setAmbient(this.graph.lightsInfo[light].ambient.r, this.graph.lightsInfo[light].ambient.g, this.graph.lightsInfo[light].ambient.b, this.graph.lightsInfo[light].ambient.a);
    	this.lights[i].setSpecular(this.graph.lightsInfo[light].specular.r, this.graph.lightsInfo[light].specular.g, this.graph.lightsInfo[light].specular.b, this.graph.lightsInfo[light].specular.a);
    	this.lights[i].setVisible(true);

		if(this.graph.lightsInfo[light].enable){ 
			this.lights[i].enable();
		}
		this.lights[i].update;
		i++;
	}
};

XMLscene.prototype.processIllumination = function(){
	
	this.gl.clearColor(this.graph.illuminationInfo.background.r,
		this.graph.illuminationInfo.background.g,
		this.graph.illuminationInfo.background.b,
		this.graph.illuminationInfo.background.a);

	this.setGlobalAmbientLight(this.graph.illuminationInfo.ambient.r,
		this.graph.illuminationInfo.ambient.g,
		this.graph.illuminationInfo.ambient.b,
		this.graph.illuminationInfo.ambient.a);
};


XMLscene.prototype.processLeaves = function(){

	this.leaves = {};
	for(leaf in this.graph.leavesInfo){
		switch(this.graph.leavesInfo[leaf].type){

			case "rectangle":
				this.leaves[leaf] = new Rectangle(this, 
					this.graph.leavesInfo[leaf].args.ltX, 
					this.graph.leavesInfo[leaf].args.ltY, 
					this.graph.leavesInfo[leaf].args.rbX, 
					this.graph.leavesInfo[leaf].args.rbY);
				this.leaves[leaf].type = "rectangle";
				break;
			case "triangle":
				this.leaves[leaf] = new Triangle(this, 
					this.graph.leavesInfo[leaf].args.x0, 
					this.graph.leavesInfo[leaf].args.y0, 
					this.graph.leavesInfo[leaf].args.z0, 
					this.graph.leavesInfo[leaf].args.x1, 
					this.graph.leavesInfo[leaf].args.y1, 
					this.graph.leavesInfo[leaf].args.z1, 
					this.graph.leavesInfo[leaf].args.x2, 
					this.graph.leavesInfo[leaf].args.y2,
					this.graph.leavesInfo[leaf].args.z2);
				this.leaves[leaf].type = "triangle";
				break;
			case "cylinder":
				this.leaves[leaf] = new Cylinder(this, 
				this.graph.leavesInfo[leaf].args.height, 
				this.graph.leavesInfo[leaf].args.bRad, 
				this.graph.leavesInfo[leaf].args.tRad, 
				this.graph.leavesInfo[leaf].args.stacks, 
				this.graph.leavesInfo[leaf].args.slices);
				this.leaves[leaf].type = "cylinder";
				break;
			case "sphere":
				this.leaves[leaf] = new Sphere(this, 
					 this.graph.leavesInfo[leaf].args.rad, 
					 this.graph.leavesInfo[leaf].args.stacks, 
					 this.graph.leavesInfo[leaf].args.slices);
				this.leaves[leaf].type = "sphere";
			
				break;
		}

	}
		console.log(this.leaves);
	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{

	//INITIALS

	//frustum
	this.camera.near = this.graph.initialsInfo.frustum.near;
    this.camera.far = this.graph.initialsInfo.frustum.far;

    //this.axis= new CGFaxis(this.graph.initialsInfo.ref.length_axis);

    this.translate(this.graph.initialsInfo.translation.x, 
    	this.graph.initialsInfo.translation.y, 
    	this.graph.initialsInfo.translation.z);

    this.rotate(this.graph.initialsInfo.rotation[0], 1,0,0);
	this.rotate(this.graph.initialsInfo.rotation[1], 0,1,0);
	this.rotate(this.graph.initialsInfo.rotation[2], 0,0,1);
	
	this.scale(this.graph.initialsInfo.sx, 
		this.graph.initialsInfo.sy, 
		this.graph.initialsInfo.sz);

	//ILLUMINATION DONE
	this.processIllumination();
	//LIGHTS
	this.processLights();

	//LEAVES
	this.processLeaves();

	//this.processTransfMatrixes();
	//console.log(this.graph.nodes[0]);
	//this.drawNode(this.graph.nodes[0]);


};

XMLscene.prototype.drawNode = function(node){
	this.pushMatrix();

	var matID = node.material;
	var texID = node.texture;

	if(texID != "null" ) {
		currTex=texID;
		if(matID != "null"){
			currMat=matID;
		this.materials[matID].setTexture(this.texture[texID]);
		this.materials[matID].apply();
		//console.log(matID);
		//console.debug(this.materials[matID]);
		}
	}
	this.multMatrix(node.matrix);
	for(var i in node.descendants){
		if(this.isLeaf(node.descendants[i])){
			//if (texID != null)
			//console.debug(this.leaves[node.descendants[i]]);
			this.drawLeaf(this.leaves[node.descendants[i]], this.texture[currTex].amplif.s, this.texture[currTex].amplif.t);
			//console.log(node.descendants[i]);
		}
		else this.drawNode(this.graph.nodes[node.descendants[i]]);
	}
	this.popMatrix();
}

/*XMLscene.prototype.processTransfMatrixes = function(){
	
	for(node in this.graph.nodes){
		var matrix = mat4.create();
		console.log();
		for(var j in this.graph.nodes[i].count){
			if(this.graph.nodes[i].transf[j].type == 0){
				var tx = this.graph.nodes[i].transf[j].tx;
				var ty = this.graph.nodes[i].transf[j].ty;
				var tz = this.graph.nodes[i].transf[j].tz;
				mat4.translate(matrix, matrix, [tx, ty, tz]);
			}
			else if(this.graph.nodes[i].transf[j]._type == 1){
				var angle = this.graph.nodes[i].transf[j].ang;
				switch(this.graph.nodes[i].transf[j].ax){
					case "x": 
							mat4.rotate(matrix, matrix, degToRad(angle), [1,0,0]);
							break;

					case "y": 
							mat4.rotate(matrix, matrix, degToRad(angle), [0,1,0]);
							break;

					case "x": 
							mat4.rotate(matrix, matrix, degToRad(angle), [0,0,1]);
							break;
				}
			}
			else if(this.graph.nodes[i].transf[j]._type == 2){
				var sx = this.graph.nodes[i].transf[j].sx;
				var sy = this.graph.nodes[i].transf[j].sy;
				var sz = this.graph.nodes[i].transf[j].sz;
				mat4.scale(matrix,matrix,[sx,sy,sz]);
			}
		}
		this.graph.nodes[i].matrix = matrix;
		

	}
};
*/

XMLscene.prototype.drawLeaf = function(leaf, s, t){
	
}


XMLscene.prototype.updateLights = function(){
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
};


XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	//this.rect.display();
	this.sp.display();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.updateLights();

		
	};	

    this.shader.unbind();
};

/*XMLscene.prototype.processaGrafo(nodeName) = function()
{


	

};*/

