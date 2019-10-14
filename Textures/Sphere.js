// Create a sphere
function Sphere(gl) {
    this.gl = gl;
    this.attributes = {
        aTexCoord: {
            size:2,
            offset:0,
            bufferData: null,
        },
        aPosition: {
            size:3,
            offset:0,
            bufferData: null,
        },
        aNormal: {
            size:3,
            offset:0,
            bufferData: null,
        }
        
    };
    this.texture = null;
    this.textureImg = new Image();
    this.indices = null;
    this.state = {
        mm: glMatrix.mat4.create(),
        nm: null,
    };
    this.selColor = [0.1,0.05,0.2,1.0];
    this.stride = 0;
    this.objType = "Sphere";
    this.role = "body";

    // Initialization
    this.init = function(_this) {
        var sphereSegments = 12;
        var i, ai, si, ci;
        var j, aj, sj, cj;
        var p1, p2;

        // Vertices
        var vertices = [], indices = [], texcoords = [];
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

                texcoords.push(i/sphereSegments);//S
                texcoords.push(j/sphereSegments);//T
            }
        }
        _this.attributes.aPosition.bufferData = new Float32Array(vertices);
        _this.attributes.aTexCoord.bufferData = new Float32Array(texcoords);
        _this.attributes.aNormal.bufferData = new Float32Array(vertices);
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
        _this.textureImg.onload = function(){
            _this.initTextures()
        }
        _this.textureImg.src = "mars.jpg";
    }(this);

    this.initTextures = function(){
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImg);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.texture = texture;
    };

    this.calculateMatrix = function(mvp){
    };

    this.draw = function(gl){
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};