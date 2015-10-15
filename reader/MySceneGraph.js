
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
	
	var initials = getUniqueElement(rootElement, "INITIALS");

	//--frustum-- DONE
	var frustum = getUniqueElement(initials, "frustum");

	var near = this.reader.getFloat(frustum, "near");
	var far = this.reader.getFloat(frustum, "far");
	//console.log('near: ' + near + ' far: ' + far);

	//--translate-- DONE

	var translate = getUniqueElement(initials, "translation");

	var trans_x = this.reader.getFloat(translate, "x");
	var trans_y = this.reader.getFloat(translate, "y");
	var trans_z = this.reader.getFloat(translate, "z");

	//console.log('x: ' + trans_x + ' y: ' + trans_y + ' z: ' + trans_z);

	//--rotation-- DONE

	var rotation = getAllElements(initials, "rotation");

	for (var i = 0; i < rotation.length; ++i) {
		var axis = this.reader.getString(rotation[i], "axis");
		var angle = this.reader.getString(rotation[i], "angle");
		//console.log("AXIS: " + axis + " Angle: " + angle);
	}

	//--scale-- DONE

	var scale = getUniqueElement(initials, "scale");

	var sx = this.reader.getFloat(scale, "sx");
	var sy = this.reader.getFloat(scale, "sy");
	var sz = this.reader.getFloat(scale, "sz");

	//console.log("sx: " + sx + " sy: " + sy + " sz: " + sz);

	var reference = getUniqueElement(initials, "reference");

	var ref_length = this.reader.getFloat(reference, "length");

	//console.log("reference: " + ref_length);

};

MySceneGraph.prototype.parseLeaves= function(rootElement) {
	
	var leaves = getUniqueElement(rootElement, "LEAVES");

	for (var i = 0; i < leaves.children.length; ++i) {
		
		var id = this.reader.getString(leaves.children[i], "id");
		var type = this.reader.getString(leaves.children[i], "type");
		var args = this.reader.getString(leaves.children[i], "args");

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

		//console.log("ID: " + id + " Type: " + type + " Args: " + args);
	}

};



MySceneGraph.prototype.parseIllumination = function(rootElement) {
	
	var illumination = getUniqueElement(rootElement, "ILLUMINATION");

	//--ambient-- DONE
	var ambient = getUniqueElement(illumination, "ambient");

	var rA = this.reader.getFloat(ambient, "r");
	var gA = this.reader.getFloat(ambient, "g");
	var bA = this.reader.getFloat(ambient, "b");
	var aA = this.reader.getFloat(ambient, "a");

	//--background-- DONE
	var background = getUniqueElement(illumination, "background");

	var rB = this.reader.getFloat(background, "r");
	var gB = this.reader.getFloat(background, "g");
	var bB = this.reader.getFloat(background, "b");
	var aB = this.reader.getFloat(background, "a");
};

MySceneGraph.prototype.parseTextures= function(rootElement) {
	
	var textures = getUniqueElement(rootElement, "TEXTURES");

	for (var i = 0; i < textures.children.length; i++){
		var id = this.reader.getString(textures.children[i], "id")
		var file = getUniqueElement(textures.children[i], "file");
		var path = this.reader.getString(file, "path");
		//console.log("path " + path);

		var amplif_factor = getUniqueElement(textures.children[i], "amplif_factor");
		var s = this.reader.getString(amplif_factor, "s");
		var t = this.reader.getString(amplif_factor, "t");

		//console.log("s " + s + "t " + t);
	}
};

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	
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


MySceneGraph.prototype.parseLights= function(rootElement) {
	
	var lights = getUniqueElement(rootElement, "LIGHTS");
	//console.log(lights.children.length);

	for(var i = 0; i < lights.children.length; ++i){
		
		var id = this.reader.getString(lights.children[i], "id");
		var enable = getUniqueElement(lights.children[i],"enable");
		var value = this.reader.getString(enable, "value");
		//console.log("Value : " + value);

		var position = getUniqueElement(lights.children[i],"position");
		var x = this.reader.getString(position, "x");
		var y = this.reader.getString(position, "y");
		var z = this.reader.getString(position, "z");
		var w = this.reader.getString(position, "w");

		//console.log("x: " + x + " y: " + y + " z: " + z + " w: " + w);

		var ambient = getUniqueElement(lights.children[i],"ambient");
		var r = this.reader.getString(ambient, "r");
		var g = this.reader.getString(ambient, "g");
		var b = this.reader.getString(ambient, "b");
		var a = this.reader.getString(ambient, "a");

		//console.log("r: " + r + " g: " + g + " b: " + b + " a: " + a);

		var ambient = getUniqueElement(lights.children[i],"ambient");
		var a_r = this.reader.getString(ambient, "r");
		var a_g = this.reader.getString(ambient, "g");
		var a_b = this.reader.getString(ambient, "b");
		var a_a = this.reader.getString(ambient, "a");

		//console.log("r: " + a_r + " g: " + a_g + " b: " + a_b + " a: " + a_a);

		var diffuse = getUniqueElement(lights.children[i],"diffuse");
		var d_r = this.reader.getString(diffuse, "r");
		var d_g = this.reader.getString(diffuse, "g");
		var d_b = this.reader.getString(diffuse, "b");
		var d_a = this.reader.getString(diffuse, "a");

		//console.log("r: " + d_r + " g: " + d_g + " b: " + d_b + " a: " + d_a);

		var specular = getUniqueElement(lights.children[i],"specular");
		var s_r = this.reader.getString(diffuse, "r");
		var s_g = this.reader.getString(diffuse, "g");
		var s_b = this.reader.getString(diffuse, "b");
		var s_a = this.reader.getString(diffuse, "a");

		//console.log("r: " + s_r + " g: " + s_g + " b: " + s_b + " a: " + s_a);

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
		console.log(descendants.children.length);

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
	var error = this.parseLeaves(rootElement);
	var error = this.parseLights(rootElement);
	var error = this.parseIllumination(rootElement);
	var error = this.parseTextures(rootElement);
	var error = this.parseMaterials(rootElement);
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


