
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	//this.initials = new SceneInitials(); 
	this.scene = scene;
	scene.graph = this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
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
		this.initialsInfo.rotation['axis'] = this.reader.getString(rotation[i], "axis");
		this.initialsInfo.rotation['angle'] = this.reader.getString(rotation[i], "angle");
	}

	//--scale-- DONE
	var scale = getUniqueElement(initials, "scale");
	this.initialsInfo.scale = {};

	this.initialsInfo.scale['sx'] = this.reader.getFloat(scale, "sx");
	this.initialsInfo.scale['sy'] = this.reader.getFloat(scale, "sy");
	this.initialsInfo.scale['sz'] = this.reader.getFloat(scale, "sz");

	//--reference--
	var reference = getUniqueElement(initials, "reference");

	this.initialsInfo.reference = this.reader.getFloat(reference, "length");

	//console.log(this.initialsInfo);

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
	//console.log(lights.children.length);

	for(var i = 0; i < lights.children.length; ++i){
		var currLight = {};

		currLight['id'] = this.reader.getString(lights.children[i], "id");
		var enable = getUniqueElement(lights.children[i],"enable");
		currLight['enable'] = this.reader.getBoolean(enable, "value");

		var position = getUniqueElement(lights.children[i],"position");
		currLight['position'] = {};
		currLight['position']['x'] = this.reader.getString(position, "x");
		currLight['position']['y'] = this.reader.getString(position, "y");
		currLight['position']['z'] = this.reader.getString(position, "z");
		currLight['position']['w'] = this.reader.getString(position, "w");

		var ambient = getUniqueElement(lights.children[i],"ambient");
		currLight['ambient'] = {};
		currLight['ambient']['r'] = this.reader.getString(ambient, "r");
		currLight['ambient']['g'] = this.reader.getString(ambient, "g");
		currLight['ambient']['b'] = this.reader.getString(ambient, "b");
		currLight['ambient']['a'] = this.reader.getString(ambient, "a");

		var diffuse = getUniqueElement(lights.children[i],"diffuse");
		currLight['diffuse'] = {};
		currLight['diffuse']['r'] = this.reader.getString(diffuse, "r");
		currLight['diffuse']['g'] = this.reader.getString(diffuse, "g");
		currLight['diffuse']['b'] = this.reader.getString(diffuse, "b");
		currLight['diffuse']['a'] = this.reader.getString(diffuse, "a");

		var specular = getUniqueElement(lights.children[i],"specular");
		currLight['specular'] = {};
		currLight['specular']['r'] = this.reader.getString(diffuse, "r");
		currLight['specular']['g'] = this.reader.getString(diffuse, "g");
		currLight['specular']['b'] = this.reader.getString(diffuse, "b");
		currLight['specular']['a'] = this.reader.getString(diffuse, "a");

		this.lightsInfo[currLight['id']] = currLight;
	}
};

MySceneGraph.prototype.parseTextures= function(rootElement) {

	this.texturesInfo= {};
	
	var textures = getUniqueElement(rootElement, "TEXTURES");

	for (var i = 0; i < textures.children.length; i++){
		var currTexture = {};

		currTexture['id'] = this.reader.getString(textures.children[i], "id")
		var file = getUniqueElement(textures.children[i], "file");
		currTexture['file'] = this.reader.getString(file, "path");

		var amplif_factor = getUniqueElement(textures.children[i], "amplif_factor");
		currTexture['amplif_factor'] = {};
		currTexture['amplif_factor']['s'] = this.reader.getString(amplif_factor, "s");
		currTexture['amplif_factor']['t'] = this.reader.getString(amplif_factor, "t");

		this.texturesInfo[currTexture['id']] = currTexture;
	}
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	
	this.materials = {};

	var materials = getUniqueElement(rootElement, "MATERIALS");

	for (var i = 0; i < materials.children.length; i++){
		var id = this.reader.getString(materials.children[i], "id")
		var shininess = getUniqueElement(materials.children[i], "shininess");
		var value = this.reader.getFloat(shininess, "value");

		var specular = getUniqueElement(materials.children[i], "specular");
		var rS = this.reader.getString(specular, "r");
		var gS = this.reader.getString(specular, "g");
		var bS = this.reader.getString(specular, "b");
		var aS = this.reader.getString(specular, "a");

		var diffuse = getUniqueElement(materials.children[i], "diffuse");
		var rD = this.reader.getString(diffuse, "r");
		var gD = this.reader.getString(diffuse, "g");
		var bD = this.reader.getString(diffuse, "b");
		var aD = this.reader.getString(diffuse, "a");

		var ambient = getUniqueElement(materials.children[i], "ambient");
		var rA = this.reader.getString(ambient, "r");
		var gA = this.reader.getString(ambient, "g");
		var bA = this.reader.getString(ambient, "b");
		var aA = this.reader.getString(ambient, "a");

		var emission = getUniqueElement(materials.children[i], "emission");
		var rE = this.reader.getString(emission, "r");
		var gE = this.reader.getString(emission, "g");
		var bE = this.reader.getString(emission, "b");
		var aE = this.reader.getString(emission, "a");

		//console.log("id " + id + ". value: " + value);
		//console.log("rS: " + rS + ". gS: " + gS + ". bS: " + bS + ". aS: " + aS);
		//console.log("rD: " + rD + ". gD: " + gD + ". bD: " + bD + ". aD: " + aD);
		//console.log("rA: " + rA + ". gA: " + gA + ". bA: " + bA + ". aA: " + aA);
		//console.log("rE: " + rE + ". gE: " + gE + ". bE: " + bE + ". aE: " + aE);
	}
};

MySceneGraph.prototype.parseLeaves= function(rootElement) {
	
	var leaves = getUniqueElement(rootElement, "LEAVES");
	this.leavesInfo = {};

	for (var i = 0; i < leaves.children.length; ++i) {
		
		this.leavesInfo['id'] = this.reader.getString(leaves.children[i], "id");
		this.leavesInfo['type'] = this.reader.getString(leaves.children[i], "type");
		this.leavesInfo['args'] = this.reader.getString(leaves.children[i], "args");
		/*switch (type) {
			case "square":
				
				break;
			case "cylinder":
				
				break;
			case "sphere":
				
				break;
			case "triangle":
				
				break;
			default:
				return "Unknown LEAF type: " + type;*/
		//console.log(this.leavesInfo);
	}
};


MySceneGraph.prototype.parseNodes= function(rootElement) {

	var nodes = getUniqueElement(rootElement, "NODES");

	var root = getUniqueElement(nodes, "ROOT");
	var id = this.reader.getString(root,"id");
	
	for(var i = 1; i < nodes.children.length; ++i){
		
		var material = getUniqueElement(nodes.children[i], "MATERIAL");
		var texture = getUniqueElement(nodes.children[i], "TEXTURE");
		var translation = getUniqueElement(nodes.children[i], "TRANSLATION");
		var scale = getUniqueElement(nodes.children[i], "SCALE");
		var rotation = getUniqueElement(nodes.children[i], "ROTATION");
		var descendants = getUniqueElement(nodes.children[i], "DESCENDANTS");
		//console.log(descendants.children.length);

		if(material.tagName == "MATERIAL"){
			var id_m = this.reader.getString(material, "id");
			//console.log(id_m);
		}
		if(texture.tagName == "TEXTURE"){
			var id_t = this.reader.getString(texture, "id");
			//console.log(id_t);
		}
		if(translation.tagName == "TRANSLATION"){
			var trans_x = this.reader.getString(translation, "x");
			//console.log(trans_x);
			var trans_y = this.reader.getString(translation, "y");
			//console.log(trans_y);
			var trans_z = this.reader.getString(translation, "z");
			//console.log(trans_z);
		}
		if(rotation.tagName == "ROTATION"){
			var axis = this.reader.getString(rotation, "axis");
			//console.log(axis);
			var angle = this.reader.getString(rotation, "angle");
			//console.log(angle);
		}
		if(scale.tagName == "SCALE"){
			var sx = this.reader.getFloat(scale, "sx");
			//console.log(sx);
			var sy = this.reader.getFloat(scale, "sy");
			//console.log(sy);
			var sz = this.reader.getFloat(scale, "sz");
			//console.log(sz);
		}

		for(var j = 0; j < descendants.children.length; ++j){
			var descendant = this.reader.getString(descendants.children[j], "id");
			//create descedant
			//push_back 
			//console.log(descendant);
		}
		
	}

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


