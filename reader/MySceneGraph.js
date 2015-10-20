
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	//this.initials = new SceneInitials(); 
	this.scene = scene;
	scene.graph = this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	this.root_id = null;
	 
	this.reader.open('scenes/'+filename, this);  
}

 
function getUniqueElement(tag, nametag){

	var tempInitials = tag.getElementsByTagName(nametag);
	if (tempInitials == null) {
	    return (nametag + " element in " + tag + " is missing.");
	}
	if (tempInitials.length != 1) {
	    return "either zero or more than one " + nametag + " element found in" + tag + ".";
	}
	//console.log(nametag + " length: " +tempInitials.length);
	return tempInitials[0];
}

function getAllElements(tag, nametag){

	var tempInitials = tag.getElementsByTagName(nametag);
	if (tempInitials == null) {
	    return (nametag + " element in " + tag + " is missing.");
	}
	//console.log(nametag + " length: " + tempInitials[0].length);
	return tempInitials;
}

MySceneGraph.prototype.parseInitials = function(rootElement) {

	this.initialsInfo= {};
	
	var initials = getUniqueElement(rootElement, "INITIALS");

	//--frustum-- DONE
	var frustum = getUniqueElement(initials, "frustum");

	this.initialsInfo.frustum = {};

	this.initialsInfo.frustum['near'] = this.reader.getFloat(frustum, "near");
	this.initialsInfo.frustum['far'] = this.reader.getFloat(frustum, "far");

	//--translate-- DONE

	var translation = getUniqueElement(initials, "translation");

	this.initialsInfo.translation = {};

	this.initialsInfo.translation['x'] = this.reader.getFloat(translation, "x");
	this.initialsInfo.translation['y'] = this.reader.getFloat(translation, "y");
	this.initialsInfo.translation['z'] = this.reader.getFloat(translation, "z");

	//--rotation-- DONE
	var rotation = getAllElements(initials, "rotation");

	this.initialsInfo.rotation = {};

	for (var i = 0; i < rotation.length; ++i) {
		this.initialsInfo.rotation[this.reader.getString(rotation[i], "axis")] = this.reader.getFloat(rotation[i], "angle");
	}

	//--scale-- DONE
	var scale = getUniqueElement(initials, "scale");
	this.initialsInfo.scale = {};

	this.initialsInfo.scale['sx'] = this.reader.getFloat(scale, "sx");
	this.initialsInfo.scale['sy'] = this.reader.getFloat(scale, "sy");
	this.initialsInfo.scale['sz'] = this.reader.getFloat(scale, "sz");

	//--reference--
	var reference = getUniqueElement(initials, "reference");
	this.initialsInfo.ref = {};

	this.initialsInfo.ref = this.reader.getFloat(reference, "length");

};

MySceneGraph.prototype.parseIllumination = function(rootElement) {

	this.illuminationInfo= {};
	
	var illumination = getUniqueElement(rootElement, "ILLUMINATION");

	//--ambient-- DONE
	var ambient = getUniqueElement(illumination, "ambient");

	this.illuminationInfo.ambient = {};

	this.illuminationInfo.ambient['r'] = this.reader.getFloat(ambient, "r");
	this.illuminationInfo.ambient['g'] = this.reader.getFloat(ambient, "g");
	this.illuminationInfo.ambient['b'] = this.reader.getFloat(ambient, "b");
	this.illuminationInfo.ambient['a'] = this.reader.getFloat(ambient, "a");

	//--background-- DONE
	var background = getUniqueElement(illumination, "background");

	this.illuminationInfo.background = {};

	this.illuminationInfo.background['r'] = this.reader.getFloat(background, "r");
	this.illuminationInfo.background['g'] = this.reader.getFloat(background, "g");
	this.illuminationInfo.background['b'] = this.reader.getFloat(background, "b");
	this.illuminationInfo.background['a'] = this.reader.getFloat(background, "a");

	//console.log(this.illuminationInfo);
};

MySceneGraph.prototype.parseLights= function(rootElement) {

	this.lightsInfo= {};
	
	var lights = getUniqueElement(rootElement, "LIGHTS");

	for(var i = 0; i < lights.children.length; ++i){
		
		this.light = {};

		this.light['id'] = this.reader.getString(lights.children[i], "id");
		var enable = getUniqueElement(lights.children[i],"enable");
		this.light['enable'] = this.reader.getBoolean(enable, "value");

		var position = getUniqueElement(lights.children[i],"position");
		this.light['position'] = {};
		this.light['position']['x'] = this.reader.getString(position, "x");
		this.light['position']['y'] = this.reader.getString(position, "y");
		this.light['position']['z'] = this.reader.getString(position, "z");
		this.light['position']['w'] = this.reader.getString(position, "w");

		var ambient = getUniqueElement(lights.children[i],"ambient");
		this.light['ambient'] = {};
		this.light['ambient']['r'] = this.reader.getString(ambient, "r");
		this.light['ambient']['g'] = this.reader.getString(ambient, "g");
		this.light['ambient']['b'] = this.reader.getString(ambient, "b");
		this.light['ambient']['a'] = this.reader.getString(ambient, "a");

		var diffuse = getUniqueElement(lights.children[i],"diffuse");
		this.light['diffuse'] = {};
		this.light['diffuse']['r'] = this.reader.getString(diffuse, "r");
		this.light['diffuse']['g'] = this.reader.getString(diffuse, "g");
		this.light['diffuse']['b'] = this.reader.getString(diffuse, "b");
		this.light['diffuse']['a'] = this.reader.getString(diffuse, "a");

		var specular = getUniqueElement(lights.children[i],"specular");
		this.light['specular'] = {};
		this.light['specular']['r'] = this.reader.getString(diffuse, "r");
		this.light['specular']['g'] = this.reader.getString(diffuse, "g");
		this.light['specular']['b'] = this.reader.getString(diffuse, "b");
		this.light['specular']['a'] = this.reader.getString(diffuse, "a");

		this.lightsInfo[this.light['id']] = this.light;
	}
};

MySceneGraph.prototype.parseTextures= function(rootElement) {

	this.texturesInfo= {};
	
	var textures = getUniqueElement(rootElement, "TEXTURES");

	for (var i = 0; i < textures.children.length; i++){
		var texture = {};

		texture['id'] = this.reader.getString(textures.children[i], "id")
		var file = getUniqueElement(textures.children[i], "file");
		texture['path'] = this.reader.getString(file, "path");

		var amplif_factor = getUniqueElement(textures.children[i], "amplif_factor");
		texture['amplif_factor'] = {};
		texture['amplif_factor']['s'] = this.reader.getFloat(amplif_factor, "s");
		texture['amplif_factor']['t'] = this.reader.getFloat(amplif_factor, "t");

		this.texturesInfo[texture['id']] = texture;
	}
	//console.log(this.texturesInfo);
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	
	this.materialsInfo = {};

	var materials = getUniqueElement(rootElement, "MATERIALS");

	for (var i = 0; i < materials.children.length; i++){

		this.material = {};
		this.material['id'] = this.reader.getString(materials.children[i], "id")
		var shininess = getUniqueElement(materials.children[i], "shininess");
		this.material['shininess'] = this.reader.getFloat(shininess, "value");

		this.material['specular'] = {};
		var specular = getUniqueElement(materials.children[i], "specular");
		this.material['specular']['r'] = this.reader.getFloat(specular, "r");
		this.material['specular']['g'] = this.reader.getFloat(specular, "g");
		this.material['specular']['b'] = this.reader.getFloat(specular, "b");
		this.material['specular']['a'] = this.reader.getFloat(specular, "a");

		this.material['diffuse'] = {};
		var diffuse = getUniqueElement(materials.children[i], "diffuse");
		this.material['diffuse']['r'] = this.reader.getFloat(diffuse, "r");
		this.material['diffuse']['g'] = this.reader.getFloat(diffuse, "g");
		this.material['diffuse']['b'] = this.reader.getFloat(diffuse, "b");
		this.material['diffuse']['a'] = this.reader.getFloat(diffuse, "a");

		this.material['ambient'] = {};
		var ambient = getUniqueElement(materials.children[i], "ambient");
		this.material['ambient']['r'] = this.reader.getFloat(ambient, "r");
		this.material['ambient']['g'] = this.reader.getFloat(ambient, "g");
		this.material['ambient']['b'] = this.reader.getFloat(ambient, "b");
		this.material['ambient']['a'] = this.reader.getFloat(ambient, "a");

		this.material['emission'] = {};
		var emission = getUniqueElement(materials.children[i], "emission");
		this.material['emission']['r'] = this.reader.getFloat(emission, "r");
		this.material['emission']['g'] = this.reader.getFloat(emission, "g");
		this.material['emission']['b'] = this.reader.getFloat(emission, "b");
		this.material['emission']['a'] = this.reader.getFloat(emission, "a");

		this.materialsInfo[this.material['id']] = this.material;
	}
	//console.log(this.materialsInfo);

};

MySceneGraph.prototype.parseLeaves= function(rootElement) {
	
	var leaves = getUniqueElement(rootElement, "LEAVES");
	this.leavesInfo = {};

	for (var i = 0; i < leaves.children.length; ++i) {
		this.leave = {};

		this.leave['id'] = this.reader.getString(leaves.children[i], "id");
		this.leave['type'] = this.reader.getString(leaves.children[i], "type");
		var arguments = this.reader.getString(leaves.children[i], "args");

		switch (this.leave.type) {
			case "rectangle":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 4)
					return "Rectangle - Must be 4 args: <leftTopX> <leftTopY> <rightBottomX> <rightBottomY>";
				
				this.leave['args'] = {};
				this.leave['args']['ltX'] = parseFloat(argsSplit[0]);
				this.leave['args']['ltY'] = parseFloat(argsSplit[1]);
				this.leave['args']['rbX'] = parseFloat(argsSplit[2]);
				this.leave['args']['rbY'] = parseFloat(argsSplit[3]);
				//console.log(this.leave);

				break;
			case "cylinder":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 5)
					return "Cylinder - Must be 5 args: <height> <bottomRad> <topRad> <stacks> <slices>";
				
				this.leave['args'] = {};
				this.leave['args']['height'] = parseFloat(argsSplit[0]);
				this.leave['args']['bRad'] = parseFloat(argsSplit[1]);
				this.leave['args']['tRad'] = parseFloat(argsSplit[2]);
				this.leave['args']['stacks'] = parseFloat(argsSplit[3]);
				this.leave['args']['slices'] = parseFloat(argsSplit[4]);
				//console.log(this.leave);
				
				break;
			case "sphere":
				var argsSplit = arguments.split(" ");
				if(argsSplit.length != 3)
					return "Sphere - Must be 3 args: <rad> <stacks> <slices>";
				
				this.leave['args'] = {};
				this.leave['args']['rad'] = parseFloat(argsSplit[0]);
				this.leave['args']['stacks'] = parseFloat(argsSplit[1]);
				this.leave['args']['slices'] = parseFloat(argsSplit[2]);
				//console.log(this.leave);
				
				break;
			case "triangle":
				var argsSplit = arguments.split(" ");
				//console.log(argsSplit);
				if(argsSplit.length != 11)
					return "Triangle - Must be 9 args: <xLeftBottom> <yLeftBottom> <zLeftBottom> <xMiddleTop> <yMiddleTop> <zMiddleTop> <xRightBottom> <yRightBottom> <zRightBottom>";
				
				this.leave['args'] = {};
				this.leave['args']['x0'] = parseFloat(argsSplit[0]);
				this.leave['args']['y0'] = parseFloat(argsSplit[1]);
				this.leave['args']['z0'] = parseFloat(argsSplit[2]);

				this.leave['args']['x1'] = parseFloat(argsSplit[4]);
				this.leave['args']['y1'] = parseFloat(argsSplit[5]);
				this.leave['args']['z1'] = parseFloat(argsSplit[6]);

				this.leave['args']['x2'] = parseFloat(argsSplit[8]);
				this.leave['args']['y2'] = parseFloat(argsSplit[9]);
				this.leave['args']['z2'] = parseFloat(argsSplit[10]);

				console.log(this.leave.args.x0);
				console.log(this.leave.args.y0);

				//console.log(this.leave);
				
				break;
			default:
				return "Unknown LEAF type: " + this.leavesInfo.type;
			}

			this.leavesInfo[this.leave['id']] = this.leave;
		}
		//console.log(this.leavesInfo);
};

MySceneGraph.prototype.parseNodes = function(rootElement){

	var nodeList = getUniqueElement(rootElement, 'NODES');
	//console.log(nodeList);

	var nodes = nodeList.getElementsByTagName('NODE');
	//console.log(nodes);

	console.log(nodes.length + " nodes to be processed");

	this.nodesInfo = {};

	for(var i = 0; i < nodes.length; i++){

		this.node = {};
		var id = this.reader.getString(nodes[i],"id");
		this.node['id'] = this.reader.getString(nodes[i],"id");
		//console.log(this.node.id);

		
		var material = getUniqueElement(nodes[i],'MATERIAL');
		
		if(material.tagName == 'MATERIAL'){
			this.node['material'] = {};
			this.node['material'] = this.reader.getString(material, 'id');
			//console.log("ID MATERIAL: " + this.node.material);
		}

		var texture = getUniqueElement(nodes[i], "TEXTURE");
		if(texture.tagName == 'TEXTURE'){
			this.node['texture'] = {};
			this.node['texture'] = this.reader.getString(texture, 'id');
			//console.log("ID TEXTURE: " + this.node.texture);
	}
		var descendants = getUniqueElement(nodes[i], "DESCENDANTS");
		this.node['descendants'] = {};
		var desc = descendants.getElementsByTagName('DESCENDANT');
		//console.log(desc);

		for(var j = 0; j < desc.length; j++){
			var id_d = this.reader.getString(desc[j], 'id');
			//console.log("DESC ID: " + id_d);

			this.node['descendants'][j] = id_d;
		}

		//console.log(this.node.descendants);

		var transformations = nodes[i].getElementsByTagName('*');
		//console.log(trasnformations);
		this.node['transformations'] = {};
		var order = 0;

		for(var j = 0; j < transformations.length; j++){

			this.node['transformations'][order] = {};
			
			if(transformations[j].tagName == "TRANSLATION"){
			
			this.node['transformations'][order].type = "translation";
			this.node['transformations'][order].x = this.reader.getFloat(transformations[j], 'x');
			this.node['transformations'][order].y= this.reader.getFloat(transformations[j],'y');
			this.node['transformations'][order].z = this.reader.getFloat(transformations[j],'z');
			order++;
			}

			if(transformations[j].tagName == "ROTATION"){

			this.node['transformations'][order].type = "rotation";
			this.node['transformations'][order].axis = this.reader.getString(transformations[j],'axis');
			this.node['transformations'][order].angle = this.reader.getFloat(transformations[j],'angle');
			order++;
			}

			if(transformations[j].tagName == "SCALE"){

			this.node['transformations'][order].type = "scale";
			this.node['transformations'][order].sx = this.reader.getFloat(transformations[j],'sx');
			this.node['transformations'][order].sy = this.reader.getFloat(transformations[j],'sy');
			this.node['transformations'][order].sz = this.reader.getFloat(transformations[j],'sz');
			order++;

			}
		}
		this.nodesInfo[this.node['id']] = this.node;
		//console.log(this.nodesInfo);
	}

	var root = nodeList.getElementsByTagName('ROOT');

	this.root_id = root[0].attributes.getNamedItem("id").value;
	//console.log("ROOT_ID: " + this.root_id);

};




/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);
	var error = this.parseIllumination(rootElement);
	var error = this.parseLights(rootElement);
	var error = this.parseTextures(rootElement);
	var error = this.parseMaterials(rootElement);
	var error = this.parseLeaves(rootElement);
	var error = this.parseNodes(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */

	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


