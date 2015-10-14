
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
	console.log(nametag + " length: " +tempInitials.length);
	return tempInitials[0];
}

function getAllElements(tag, nametag){

	var tempInitials = tag.getElementsByTagName(nametag);
	if (tempInitials == null) {
	    return (nametag + " element in " + tag + " is missing.");
	}
	console.log(nametag + " length: " + tempInitials[0].length);
	return tempInitials;
}

MySceneGraph.prototype.parseInitials = function(rootElement) {
	
	var initials = getUniqueElement(rootElement, "INITIALS");

	//--frustum-- DONE
	var frustum = getUniqueElement(initials, "frustum");

	var near = this.reader.getFloat(frustum, "near");
	var far = this.reader.getFloat(frustum, "far");
	console.log('near: ' + near + ' far: ' + far);

	//--translate-- DONE

	var translate = getUniqueElement(initials, "translate");

	var trans_x = this.reader.getFloat(translate, "x");
	var trans_y = this.reader.getFloat(translate, "y");
	var trans_z = this.reader.getFloat(translate, "z");

	console.log('x: ' + trans_x + ' y: ' + trans_y + ' z: ' + trans_z);

	//--rotation-- DONE

	var rotation = getAllElements(initials, "rotation");

	for (var i = 0; i < rotation.length; ++i) {
		var axis = this.reader.getString(rotation[i], "axis");
		var angle = this.reader.getString(rotation[i], "angle");
		console.log("AXIS: " + axis + " Angle: " + angle);
	}

	//--scale-- DONE

	var scale = getUniqueElement(initials, "scale");

	var sx = this.reader.getFloat(scale, "sx");
	var sy = this.reader.getFloat(scale, "sy");
	var sz = this.reader.getFloat(scale, "sz");

	console.log("sx: " + sx + " sy: " + sy + " sz: " + sz);

	var reference = getUniqueElement(initials, "reference");

	var ref_length = this.reader.getFloat(reference, "length");

	console.log("reference: " + ref_length);

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

		console.log("ID: " + id + " Type: " + type + " Args: " + args);
	}

};

MySceneGraph.prototype.parseLights= function(rootElement) {
	
	var lights = getUniqueElement(rootElement, "LIGHTS");

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


