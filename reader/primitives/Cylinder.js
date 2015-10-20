function Cylinder(scene, height, botradius, topradius, stacks, slices) {
       
        CGFobject.call(this,scene);
 
        this.slices=slices;
        this.stacks=stacks;
        this.height=height;
        this.botradius=botradius;
        this.topradius=topradius;

        this.initBuffers();
};
 
 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;
 
 Cylinder.prototype.initBuffers = function() {
 
        var degToRad = Math.PI / 180.0;
 
        var ang = 360 * degToRad / this.slices;
 
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
 
        var ind_j = 0;
        var aux_j = 4 * this.slices;
 
        var aux_br = 1;
        var aux_tr = 0;
 
        for (j = 0; j < this.stacks; j++) {
               
                var ang_now = 0;
                var ind_i = 0;
 
                for (i = 0; i < this.slices; i++) {
 
                        var x1 = Math.cos(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
                        var y1 = Math.sin(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
                        var z1 = j / this.stacks - 0.5;
                        var x3 = Math.cos(ang_now) * ((aux_br-1/this.stacks) * this.botradius + (aux_tr+1/this.stacks) * this.topradius);
                        var y3 = Math.sin(ang_now) * ((aux_br-1/this.stacks) * this.botradius + (aux_tr+1/this.stacks) * this.topradius);
                        ang_now += ang;
                        var x2 = Math.cos(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
                        var y2 = Math.sin(ang_now) * (aux_br * this.botradius + aux_tr * this.topradius);
                        var z2 = (j + 1) / this.stacks - 0.5;
                        var x4 = Math.cos(ang_now) * ((aux_br-1/this.stacks) * this.botradius + (aux_tr+1/this.stacks) * this.topradius);
                        var y4 = Math.sin(ang_now) * ((aux_br-1/this.stacks) * this.botradius + (aux_tr+1/this.stacks) * this.topradius);
                        
                        this.vertices.push(x1);
                        this.vertices.push(y1);
                        this.vertices.push(z1); // vertex 0
                        
                        this.vertices.push(x2);
                        this.vertices.push(y2);
                        
                        this.vertices.push(z1); // vertex 1
                        this.vertices.push(x3)
                        this.vertices.push(y3);
                        
                        this.vertices.push(z2); // vertex 2
                        this.vertices.push(x4);
                        this.vertices.push(y4);
                        this.vertices.push(z2); 
 
                        var ind_i_j = ind_i + ind_j;
 
                        this.indices.push(ind_i_j);             
                        this.indices.push(ind_i_j + 1); 
                        this.indices.push(ind_i_j + 2); 
 
                        this.indices.push(ind_i_j + 3); 
                        this.indices.push(ind_i_j + 2); 
                        this.indices.push(ind_i_j + 1); 
 
                        ind_i += 4;
 
                       
                        this.normals.push(x1);
                        this.normals.push(y1);
                        this.normals.push(0);
                       
                    
                        this.normals.push(x2);
                        this.normals.push(y2);
                        this.normals.push(0);
 
                    
                        this.normals.push(x1);
                        this.normals.push(y1);
                        this.normals.push(0);
                       
                  
                        this.normals.push(x2);
                        this.normals.push(y2);
                        this.normals.push(0);
 
                     
                        this.texCoords.push(1 - i / this.slices, j / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, j / this.stacks);
                        this.texCoords.push(1 - i / this.slices, (j + 1) / this.stacks);
                        this.texCoords.push(1 - (i + 1) / this.slices, (j + 1) / this.stacks);
 
                }                      
                ind_j += aux_j;
 
                aux_br -= 1/this.stacks;
                aux_tr += 1/this.stacks;
               
        }
 
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
 
 
 };