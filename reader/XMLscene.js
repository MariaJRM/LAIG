
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

    this.leaves = {};
    this.textures = {};
    this.materials = {};


   this.axis=new CGFaxis(this);
	
};


XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), 
    	vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    for(material in this.materials){
    	if(material == "default"){

    		//console.log(this.materials[material]);
    		//this.materials[material].apply();
    		break;
    	}
    }
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
		this.textures[texture].amp = {};
		this.textures[texture].amp.s = this.graph.texturesInfo[texture].amplif_factor.s; 
		this.textures[texture].amp.t = this.graph.texturesInfo[texture].amplif_factor.t; 
	
	//console.log("AQUIIIIIIII");
	//console.log(this.texture);

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
		//console.log(this.leaves);
	
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

	// TRANSFORMATIONS
	for(node in this.graph.nodesInfo)
	{
		var matrix = mat4.create();
		console.log(this.graph.nodesInfo[node].transformations);
		for(trans in this.graph.nodesInfo[node].transformations){
			
			if(this.graph.nodesInfo[node].transformations[trans].type == "translation"){
				
				//--------------
				var tx = this.graph.nodesInfo[node].transformations[trans].x;
				var ty = this.graph.nodesInfo[node].transformations[trans].y;
				var tz = this.graph.nodesInfo[node].transformations[trans].z;
				console.log("tx:" + tx);
				console.log("ty:" + ty);
				console.log("tz:" + tz);
				//-----------------
				mat4.translate(matrix, matrix, 
					[this.graph.nodesInfo[node].transformations[trans].x, 
					this.graph.nodesInfo[node].transformations[trans].y, 
					this.graph.nodesInfo[node].transformations[trans].z
					]);
			}
			else if(this.graph.nodesInfo[node].transformations[trans].type == "rotation"){
				var angle = this.graph.nodesInfo[node].transformations[trans].angle;
				var axis = this.graph.nodesInfo[node].transformations[trans].axis;
				if(axis == "x"){
							console.log("Angle: "+ angle + " AXIS: x");
							mat4.rotate(matrix, matrix, convertDegtoRad(angle), [1,0,0]);
				}
				else if(axis == "y"){
					console.log("Angle: "+ angle + " AXIS: y");
							mat4.rotate(matrix, matrix, convertDegtoRad(angle), [0,1,0]);
						

				}
				else if(axis == "z"){
					console.log("Angle: "+ angle + " AXIS: z");
					mat4.rotate(matrix, matrix, convertDegtoRad(angle), [0,0,1]);
						
				}
								
			}
			else if(this.graph.nodesInfo[node].transformations[trans].type == "scale"){
				var sx = this.graph.nodesInfo[node].transformations[trans].sx;
				var sy = this.graph.nodesInfo[node].transformations[trans].sy;
				var sz = this.graph.nodesInfo[node].transformations[trans].sz;
				console.log("sx:" +sx);
				console.log("sy:" +sy);
				console.log("sz:" +sz);
				mat4.scale(matrix,matrix,
					[this.graph.nodesInfo[node].transformations[trans].sx,
					this.graph.nodesInfo[node].transformations[trans].sy,
					this.graph.nodesInfo[node].transformations[trans].sz]);
			}
		}
		this.graph.nodesInfo[node].matrix = matrix;
		//console.log(this.graph.nodesInfo[node].matrix );
	}

	// draw node
	//this.drawNode(this.graph.nodesInfo[this.graph.root_id]);

};

/*XMLscene.prototype.drawNode = function (node){
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
	}//}
	this.multMatrix(node.matrix);
	for(var i in node.descendants){
		console.log(node.descendants);
		if(this.isLeaf(node.descendants[i])){
			//if (texID != null)
			//console.debug(this.leaves[node.descendants[i]]);
			this.drawLeaf(this.leaves[node.descendants[i]], this.texture[currTex].amplif.s, this.texture[currTex].amplif.t);
			//console.log(node.descendants[i]);
		}
		else this.drawNode(this.graph.nodes[node.descendants[i]]);
	}
	this.popMatrix();
};

XMLscene.prototype.drawLeaf = function (leaf, s, t){
	if(leaf.type == "rectangle"){
		leaf = new Rectangle(this, leaf.ltx, leaf.lty, leaf.rbx, leaf.rby);
		leaf.display();
	}
	else if(leaf.type == "triangle"){
		leaf = new Triangle(this, leaf.x1, leaf.y1, leaf.z1, leaf.x2, leaf.y2, 
			leaf.z2, leaf.x3, leaf.y3, leaf.z3);
		leaf.display();
	}
	else if (leaf.type== "cylinder"){
		leaf = new Cylinder(this, leaf.height, leaf.stacks, leaf.slices, leaf.brad, leaf.trad); 
		leaf.display();
	}
	else if(leaf.type == "sphere"){
		leaf = new Sphere(this, leaf.radius, leaf.stacks, leaf.slices);
		leaf.display();
	}
};


XMLscene.prototype.isLeaf = function (id){
	for(var i in this.graph.leavesInfo){
		console.log(this.graph.leavesInfo)
		if (id==i) return true;
	}
	return false;
};*/


XMLscene.prototype.display = function () {
   
    this.shader.bind();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	this.updateProjectionMatrix();
    this.loadIdentity();

    this.applyViewMatrix();
	
	// LSX LOADED
	if (this.graph.loadedOk)
	{
		//this.setDefaultAppearance();

		if(this.axis.length != 0) this.axis.display();

		//update lights
		for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();

		//nodes
		//this.drawNode(this.graph.nodes[this.graph.scene_id]);


		
	};	

    this.shader.unbind();
};
