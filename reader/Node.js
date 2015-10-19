function Node(id) {
	this.id = id;
	this.material = null;
	this.texture = null;

	this.descendants = [];
	this.matrix = mat4.create();
}

Node.prototype.push = function(nodename) {
	this.descendants.push(nodename);
};

Node.prototype.setMaterial(material) {
	this.material = material;
};

Node.prototype.setTexture(texure) {
	this.texture = texture;
}

Node.prototype.setMatrix = function(m) {
	this.m = mat4.clone(m);
	console.log(this.m);
}