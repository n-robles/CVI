// Create a sphere
function Sphere() {
    this.attributes = {
        aColor: {
            size:4,
            offset:0,
            bufferData: null,
        },
        aPosition: {
            size:3,
            offset:0,
            bufferData: null,
        }
    };
    this.indices = null;
    this.state = {
        mm: mat4.create(),
        nm: null,
    };
    this.selColor = [0.3,0.2,0.6,1.0];
    this.stride = 0;
    this.objType = "Sphere";

    // Initialization
    this.init = function(_this) {
    var sphereSegments = 12;
    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    // Vertices
    var vertices = [], indices = [];
    for (j = 0; j <= sphereSegments; j++) {
        aj = j * Math.PI / sphereSegments;
        sj = 1.5*Math.sin(aj);
        cj = 1.5*Math.cos(aj);
        for (i = 0; i <= sphereSegments; i++) {
            ai = i * 2 * Math.PI / sphereSegments;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            vertices.push(si * sj);  // X
            vertices.push(cj);       // Y
            vertices.push(ci * sj);  // Z
        }
    }
    _this.attributes.aPosition.bufferData = new Float32Array(vertices);
    //_this.attributes.aColor.bufferData = new Float32Array(vertices);
    // Indices
    for (j = 0; j < sphereSegments; j++) {
        for (i = 0; i < sphereSegments; i++) {
            p1 = j * (sphereSegments+1) + i;
            p2 = p1 + (sphereSegments+1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }
    _this.indices = new Uint8Array(indices);

    // Selection color
    var selColor = [];
    for (j = 0; j <= sphereSegments; j++) {
        for (i = 0; i <= sphereSegments; i++) {
            selColor.push(_this.selColor[0]);
            selColor.push(_this.selColor[1]);
            selColor.push(_this.selColor[2]);
            selColor.push(_this.selColor[3]);
        }
    }
    _this.attributes.aColor.bufferData = new Float32Array(selColor);
    /*_this.attributes.aSelColor = {
        size:4,
        offset:0,
        bufferData: new Float32Array(selColor),
    };*/
    }(this);

    this.calculateMatrix = function(mvp){
        
    };

    this.draw = function(gl){
        state.gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};