
function Node() {
	this.material = null;
	this.texture = null;
	this.descendants = [];
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