// Create a sphere
function Sphere(gl, radius, type, role) {
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
    this.stride = 0;
    this.objType = "Sphere";
    this.radius = radius;
    this.type = type;
    this.role = role;

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
            sj = _this.radius*Math.sin(aj);
            cj = _this.radius*Math.cos(aj);
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
        _this.textureImg.crossorigin = "anonymous";
        if (_this.role === "plane"){
            _this.textureImg.src = "rustymetal.jpg";
        }
        else if(_this.role === "sun"){
            _this.textureImg.src = "sun.jpg";
        }
        else{
            _this.textureImg.src = "mars.jpg";
        }
    }(this);

    this.initTextures = function(){
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (this.role === "plane"){
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImg);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        else{
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImg);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.texture = texture;
    };

    this.calculateMatrix = function(mvp){
        var translation = glMatrix.vec3.create();
        if (this.type === "SUN"){
            glMatrix.vec3.set (translation, 0, 0, 7.0);
            glMatrix.mat4.translate (mvp, mvp, translation);
        }
        else if (this.type === "MODEL"){
            glMatrix.vec3.set (translation, 0, 3.5, 0);
            //glMatrix.mat4.translate (mvp, mvp, translation);
        }
    };

    this.draw = function(gl){
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};