
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

    


    this.sp = new Sphere(this,convertDegtoRad(360),20,20);
   //this.cyl = new Cylinder(this,3,convertDegtoRad(360),convertDegtoRad(360),20,20,0,0);

   this.axis=new CGFaxis(this);
	
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

XMLscene.prototype.processTextures = function(){

	this.texture = {};
	for(texture in this.graph.texturesInfo){
		this.texture[texture] = new CGFtexture(this,this.graph.texturesInfo[texture].path);
		this.texture[texture].amp = {};
		this.texture[texture].amp.s = this.graph.texturesInfo[texture].amplif_factor.s; 
		this.texture[texture].amp.t = this.graph.texturesInfo[texture].amplif_factor.t; 
	
	console.log("AQUIIIIIIII");
	console.log(this.texture);

	}
}

XMLscene.prototype.processMaterials = function(){

	this.materials = {};

	for(material in this.graph.materialsInfo){

		this.materials[material] = new CGFappearance(this);
		this.materials[material].setShininess(this.graph.materialsInfo[material].shininess);

		this.materials[material].setSpecular(this.graph.materialsInfo[material].specular.r,
			this.graph.materialsInfo[material].specular.g,
			this.graph.materialsInfo[material].specular.b,
			this.graph.materialsInfo[material].specular.a);

		this.materials[material].setDiffuse(this.graph.materialsInfo[material].diffuse.r,
			this.graph.materialsInfo[material].diffuse.g,
			this.graph.materialsInfo[material].diffuse.b,
			this.graph.materialsInfo[material].diffuse.a
			);

		this.materials[material].setAmbient(this.graph.materialsInfo[material].ambient.r,
			this.graph.materialsInfo[material].ambient.g,
			this.graph.materialsInfo[material].ambient.b,
			this.graph.materialsInfo[material].ambient.a
			);

		this.materials[material].setEmission(this.graph.materialsInfo[material].emission.r,
			this.graph.materialsInfo[material].emission.g,
			this.graph.materialsInfo[material].emission.b,
			this.graph.materialsInfo[material].emission.a);

	}

	console.log(this.materials);
}


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



XMLscene.prototype.drawLeaf = function (leaf, s, t){
	
	if(leaf._type == "rectangle"){
		if(s!=1 || t!=1){
		leaf = new Rectangle(this, leaf.ltx, leaf.lty, leaf.rbx, leaf.rby, s, t);
	}
		leaf.display();
	}
	else if(leaf._type == "triangle"){
		if(s!=1 || t!=1){
		leaf = new Triangle(this, leaf.x1, leaf.y1, leaf.z1, leaf.x2, leaf.y2, 
			leaf.z2, leaf.x3, leaf.y3, leaf.z3, s, t);
	}
		leaf.display();
	}
	else if (leaf._type== "cylinder"){
		if(s!=1 || t!=1){
		leaf = new Cylinder(this, leaf.height, leaf.stacks, leaf.slices, leaf.brad, leaf.trad); // s e t
	}
		this.scale(1,leaf.height,1);
		leaf.display();
	}
	else if(leaf._type == "sphere"){
		if(s!=1 || t!=1){
		leaf = new Sphere(this, leaf.radius, leaf.stacks, leaf.slices, s, t);
	}
		this.scale(leaf.radius*2, leaf.radius*2, leaf.radius*2);
		leaf.display();
	}
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{

	//INITIALS

	//frustum
	this.camera.near = this.graph.initialsInfo.frustum.near;
    this.camera.far = this.graph.initialsInfo.frustum.far;

    this.axis = new CGFaxis(this, this.graph.initialsInfo.ref);

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

	//TEXTURES
	this.processTextures();

	//MATERIALS
	this.processMaterials();

	//this.processTransfMatrixes();
	//console.log(this.graph.nodes[0]);
	//this.drawNode(this.graph.nodes[0]);


};

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
	//this.cyl.display();
	
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

