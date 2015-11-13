/*
 * Method to convert degrees to radians
 */
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
    this.enableTextures(true);

    this.lightEnable = []; 

    this.leaves = {};
    this.textures = {};
    this.materials = {};
    this.animations = {};
    this.a_material=null;
    this.a_texture=null;
    

   	this.axis=new CGFaxis(this);

   	
	this.setUpdatePeriod(10);
	//this.i = 0;
	
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

/*
 * Method to process the parsing of Lights
 */
XMLscene.prototype.processLights = function(){

	this.lights = [];
	this.lightIDs = [];
	
	var i = 0;
    for(light in this.graph.lightsInfo){
    	this.lights[i] = new CGFlight(this,i);
    	
    	var temp_id = this.graph.lightsInfo[light].id;
    	this.lights[i].setPosition(this.graph.lightsInfo[light].position.x, this.graph.lightsInfo[light].position.y, this.graph.lightsInfo[light].position.z, this.graph.lightsInfo[light].position.w);
    	this.lights[i].setDiffuse(this.graph.lightsInfo[light].diffuse.r, this.graph.lightsInfo[light].diffuse.g, this.graph.lightsInfo[light].diffuse.b, this.graph.lightsInfo[light].diffuse.a);
    	this.lights[i].setAmbient(this.graph.lightsInfo[light].ambient.r, this.graph.lightsInfo[light].ambient.g, this.graph.lightsInfo[light].ambient.b, this.graph.lightsInfo[light].ambient.a);
    	this.lights[i].setSpecular(this.graph.lightsInfo[light].specular.r, this.graph.lightsInfo[light].specular.g, this.graph.lightsInfo[light].specular.b, this.graph.lightsInfo[light].specular.a);
    	this.lights[i].setVisible(true);

    	this.lightIDs[i]=[];
    	this.lightIDs[i].id=light;

    	if(this.graph.lightsInfo[light].enable == true){
			this.lights[i].enable();
			eval("this.lightEnable" + i + " = " + true);
			this.lightEnable[i] = true;
    	}
    	else{
			this.lights[i].disable();
			eval("this.lightEnable" + i + " = " + false);
			this.lightEnable[i] = false;
    	}
		this.lights[i].update;
		i++;
	}

	this.lightsLoad = true;
};

/*
 * Method to process the parsing of Illumination
 */
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

/*
 * Method to process the parsing of Textures
 */
XMLscene.prototype.processTextures = function(){

	for(texture in this.graph.texturesInfo){
		this.textures[texture] = new CGFtexture(this,this.graph.texturesInfo[texture].path);
		this.textures[texture].path = this.graph.texturesInfo[texture].path;
		this.textures[texture].amp = {};
		this.textures[texture].amp.s = this.graph.texturesInfo[texture].amplif_factor.s; 
		this.textures[texture].amp.t = this.graph.texturesInfo[texture].amplif_factor.t; 
	}
}

/*
 * Method to process the parsing of Materials
 */
XMLscene.prototype.processMaterials = function(){

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
}

/*
 * Method to process the parsing of Leaves
 */
XMLscene.prototype.processLeaves = function(){

	for(leaf in this.graph.leavesInfo){
		switch(this.graph.leavesInfo[leaf].type){
			case "rectangle":
				this.leaves[leaf] = new Rectangle(this, 
					this.graph.leavesInfo[leaf].args.ltX, 
					this.graph.leavesInfo[leaf].args.ltY, 
					this.graph.leavesInfo[leaf].args.rbX, 
					this.graph.leavesInfo[leaf].args.rbY,1,1);
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
					this.graph.leavesInfo[leaf].args.z2,1,1);
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
};

XMLscene.prototype.processAnimations = function(){

	for(anim in this.graph.animationsInfo){
		//console.log(anim);
		//console.log(this.graph.animationsInfo);
		if(this.graph.animationsInfo[anim].type == "linear"){
			this.animations[this.graph.animationsInfo[anim].id] = new LinearAnimation(this,
				this.graph.animationsInfo[anim].span, 
				this.graph.animationsInfo[anim].point);
		}
		else if(this.graph.animationsInfo[anim].type == "circular"){
			this.animations[this.graph.animationsInfo[anim].id] = new CircularAnimation(this,
				this.graph.animationsInfo[anim].center, 
				this.graph.animationsInfo[anim].radius,
				this.graph.animationsInfo[anim].startang,
				this.graph.animationsInfo[anim].rotang,
				this.graph.animationsInfo[anim].span);
			//console.log("MERDAAA");	
		}
		//console.log(this.graph.animationsInfo[anim].id);
	}
	//console.log(this.animations);

}

/*
 * Handler called when the graph is loaded
 */
XMLscene.prototype.onGraphLoaded = function () 
{
	//Frustum
	this.camera.near = this.graph.initialsInfo.frustum.near;
    this.camera.far = this.graph.initialsInfo.frustum.far;

    //Axis
    this.axis = new CGFaxis(this, this.graph.initialsInfo.ref);

    //Illumination
	this.processIllumination();

	//Lights
	this.processLights();

	//Leaves
	this.processLeaves();

	//Textures
	this.processTextures();

	//Materials
	this.processMaterials();

	this.processAnimations();

	//Nodes
	for(node in this.graph.nodesInfo)
	{
		var tmatrix = mat4.create();
		for(trans in this.graph.nodesInfo[node].transformations){
			if(this.graph.nodesInfo[node].transformations[trans].type == "translation"){
				mat4.translate(tmatrix, tmatrix, 
					[this.graph.nodesInfo[node].transformations[trans].x, 
					this.graph.nodesInfo[node].transformations[trans].y, 
					this.graph.nodesInfo[node].transformations[trans].z]);
			}
			else if(this.graph.nodesInfo[node].transformations[trans].type == "rotation"){
				var angle = this.graph.nodesInfo[node].transformations[trans].angle;
				var axis = this.graph.nodesInfo[node].transformations[trans].axis;
				if(axis == "x"){
							mat4.rotate(tmatrix, tmatrix, convertDegtoRad(angle), [1,0,0]);
				}
				else if(axis == "y"){
							mat4.rotate(tmatrix, tmatrix, convertDegtoRad(angle), [0,1,0]);						

				}
				else if(axis == "z"){
					mat4.rotate(tmatrix, tmatrix, convertDegtoRad(angle), [0,0,1]);	
				}				
			}
			else if(this.graph.nodesInfo[node].transformations[trans].type == "scale"){
				mat4.scale(tmatrix,tmatrix,
					[this.graph.nodesInfo[node].transformations[trans].sx,
					this.graph.nodesInfo[node].transformations[trans].sy,
					this.graph.nodesInfo[node].transformations[trans].sz]);
			}
		}
		this.graph.nodesInfo[node].matrix = tmatrix;
	}
	this.processGraph(this.graph.nodesInfo[this.graph.root_id]);
};

/*
 * Method to determine if the node is a leaf through the node's id
 */
XMLscene.prototype.checkIfLeaf = function (id){
	for(var i in this.graph.leavesInfo){
		if (id==this.graph.leavesInfo[i].id) return true;
	}
	return false;
};

/*
 * Method to process the graph's nodes
 */	
XMLscene.prototype.processGraph = function(node){

	this.pushMatrix();

	var material = node.material;
	var texture = node.texture;
	var animation = node.animation;
	//console.log("TYPE:" + node.id);
	//console.log(animation);
	
	
	if(texture != "null" ) {
		if(material != "null"){
			this.a_material=material;
			this.a_texture=texture;
			this.materials[material].setTexture(this.textures[texture]);
			this.materials[material].apply();
		}
		else{
			this.a_texture=texture;
			this.materials[this.a_material].setTexture(this.textures[texture]);
			this.materials[this.a_material].apply();
		}
	}
	else if(material != "null"){
		this.a_material=material;
		if(this.a_texture!=undefined){
			this.materials[material].setTexture(this.textures[this.a_texture]);
		}
		this.materials[material].apply();
	}

this.multMatrix(node.matrix);
	//var mat;
	if(animation.length != 0)
	{
		for(var i=0; i < animation.length; i++){

			var an = this.animations[animation[i]];
				//console.log(an);
				/*var mat = */an.apply();
			//console.log(mat);			
			//this.multMatrix(mat);
		}
	}
	
	for(var i in node.descendants){
		
		if(this.checkIfLeaf(node.descendants[i])){
			if(this.a_texture==undefined){
				this.draw(this.leaves[node.descendants[i]],1,1);
			}
			else{
			this.draw(this.leaves[node.descendants[i]], this.textures[this.a_texture].amp.s, this.textures[this.a_texture].amp.t);
		}

		}
		else this.processGraph(this.graph.nodesInfo[node.descendants[i]]);
	}
	this.popMatrix();
}

/*
 * Method to draw the primitives
 */
XMLscene.prototype.draw = function(leaf,s,t){

	switch(leaf.type){  
		case "rectangle":
			leaf.updateAmpl(s,t);
			leaf.display();
		break;
		case "triangle":
			leaf.updateAmpl(s,t);
			leaf.display();
		break;
		case "cylinder":
			this.scale(1,1,leaf.height);
			leaf.display();
		break;
		case "sphere":
			this.scale(leaf.radius*2, leaf.radius*2, leaf.radius*2);
			leaf.display();
		break;
		default:
		return "Type of leaf " + leaf.type+ " does not exist!"; 
		break;
	}

}

/*
* Function that processes Initials Tranformations
*/
XMLscene.prototype.processInitialsTransformations = function(){
	this.translate(this.graph.initialsInfo.translation.x, 
    	this.graph.initialsInfo.translation.y, 
    	this.graph.initialsInfo.translation.z);

    	this.rotate(convertDegtoRad(this.graph.initialsInfo.rotation['x']), 1,0,0);
		this.rotate(convertDegtoRad(this.graph.initialsInfo.rotation['y']), 0,1,0);
		this.rotate(convertDegtoRad(this.graph.initialsInfo.rotation['z']), 0,0,1);
	
		this.scale(this.graph.initialsInfo.scale.sx, 
		this.graph.initialsInfo.scale.sy, 
		this.graph.initialsInfo.scale.sz);
}


XMLscene.prototype.display = function () {
   
   // this.shader.bind();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();
    this.loadIdentity();

    this.applyViewMatrix();
    this.setDefaultAppearance();
	
	if (this.graph.loadedOk)
	{
	
		if(this.axis.length != 0) this.axis.display();

		for (i = 0; i < this.lights.length; i++){
			var id = this.lightIDs[i];
			eval("this.enLight = this.lightEnable"+i);

			if(this.enLight){
			this.lights[i].enable();
			this.lights[i].update();
			}
			else if(!this.enLight){
			this.lights[i].disable();
			this.lights[i].update();
			}
		}

		this.processInitialsTransformations();

		this.processGraph(this.graph.nodesInfo[this.graph.root_id]);

	};	

  //  this.shader.unbind();
};

XMLscene.prototype.update = function(curtime){

	for(anim in this.animations){
			this.animations[anim].update(curtime);
		
	}

}
