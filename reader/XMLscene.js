
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

    this.leaves = {};
    this.textures = {};
    this.materials = {};
    this.a_material=null;
    this.a_texture=null;

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

	for(texture in this.graph.texturesInfo){
		this.textures[texture] = new CGFtexture(this,this.graph.texturesInfo[texture].path);
		this.textures[texture].path = this.graph.texturesInfo[texture].path;
		this.textures[texture].amp = {};
		this.textures[texture].amp.s = this.graph.texturesInfo[texture].amplif_factor.s; 
		this.textures[texture].amp.t = this.graph.texturesInfo[texture].amplif_factor.t; 
	}
}

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

XMLscene.prototype.onGraphLoaded = function () 
{

	this.camera.near = this.graph.initialsInfo.frustum.near;
    this.camera.far = this.graph.initialsInfo.frustum.far;

    this.axis = new CGFaxis(this, this.graph.initialsInfo.ref);

	this.processIllumination();

	this.processLights();

	this.processLeaves();

	this.processTextures();

	this.processMaterials();

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
	
XMLscene.prototype.processGraph = function(node){

	this.pushMatrix();

	var material = node.material;
	var texture = node.texture;
	
	if(texture != "null" ) {
		if(material != "null"){
			this.a_material=material;
			if(texture=="clear"){
				this.materials[material].setTexture(null);
				this.materials[material].apply();
			}
			else{
				this.a_texture=texture;
				this.materials[material].setTexture(this.textures[texture]);
				this.materials[material].apply();
			}
		}
		else{
			if(texture=="clear"){
				this.materials[this.a_material].setTexture(null);
				this.materials[this.a_material].apply();
			}
			else{
				this.a_texture=texture;
				this.materials[this.a_material].setTexture(this.textures[texture]);
				this.materials[this.a_material].apply();
			}
		}
	}
	else if(material != "null"){
		this.a_material=material;
		if(currTex!=undefined){
			this.materials[material].setTexture(this.textures[this.a_texture]);
		}
		this.materials[material].apply();
	}
	
	this.multMatrix(node.matrix);

	for(var i in node.descendants){
		
		if(this.isLeaf(node.descendants[i])){
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

XMLscene.prototype.isLeaf = function (id){
	for(var i in this.graph.leavesInfo){
		if (id==this.graph.leavesInfo[i].id) return true;
	}
	return false;
};

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
		return "Type of leaf " + leaf+ " does not exist!"; 
		break;
	}

}


XMLscene.prototype.display = function () {
   
    this.shader.bind();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();
    this.loadIdentity();

    this.applyViewMatrix();
    this.setDefaultAppearance();
	
	if (this.graph.loadedOk)
	{
	
		if(this.axis.length != 0) this.axis.display();

		for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();

		this.translate(this.graph.initialsInfo.translation.x, 
    	this.graph.initialsInfo.translation.y, 
    	this.graph.initialsInfo.translation.z);

    	this.rotate(convertDegtoRad(this.graph.initialsInfo.rotation['x']), 1,0,0);
		this.rotate(convertDegtoRad(this.graph.initialsInfo.rotation['y']), 0,1,0);
		this.rotate(convertDegtoRad(this.graph.initialsInfo.rotation['z']), 0,0,1);
	
		this.scale(this.graph.initialsInfo.scale.sx, 
		this.graph.initialsInfo.scale.sy, 
		this.graph.initialsInfo.scale.sz);

		this.processGraph(this.graph.nodesInfo[this.graph.root_id]);
	};	

    this.shader.unbind();
};
