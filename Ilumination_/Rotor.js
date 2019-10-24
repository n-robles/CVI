// Create a rotor
function Rectangle(lenght, widht, orientation, type, gl, role) {
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
    this.lenght = lenght;
    this.widht = widht;
    this.orientation = orientation;
    this.type = type;
    this.indices = null;
    this.state = {
        mm: glMatrix.mat4.create(),
        nm: null,
    };
    this.objType = "Rectangle";
    this.role = role;
    this.stride = 0;

    // Initialization
    this.init = function(_this) {
        var vertices = [], indices = [];
        if (_this.orientation === "top")
        {
            vertices = [
                -_this.widht/2, _this.lenght+0.1, -0,
                -_this.widht/2, _this.lenght+0.1, 0.05,
                _this.widht/2, _this.lenght+0.1, 0.05,
                _this.widht/2, _this.lenght+0.1, -0,
                // Left
                -_this.widht/2, _this.lenght+0.1, 0.05,
                -_this.widht/2, -0+0.1, 0.05,
                -_this.widht/2, -0+0.1, -0,
                -_this.widht/2, _this.lenght+0.1, -0,
                // Right
                _this.widht/2, _this.lenght+0.1, 0.05,
                _this.widht/2, -0+0.1, 0.05,
                _this.widht/2, -0+0.1, -0,
                _this.widht/2, _this.lenght+0.1, -0,
                // Front
                _this.widht/2, _this.lenght+0.1, 0.05,
                _this.widht/2, -0+0.1, 0.05,
                -_this.widht/2, -0+0.1, 0.05,
                -_this.widht/2, _this.lenght+0.1, 0.05,
                // Back
                _this.widht/2, _this.lenght+0.1, -0,
                _this.widht/2, -0+0.1, -0,
                -_this.widht/2, -0+0.1, -0,
                -_this.widht/2, _this.lenght+0.1, -0,
                // Bottom
                -_this.widht/2, -0+0.1, -0,
                -_this.widht/2, -0+0.1, 0.05,
                _this.widht/2, -0+0.1, 0.05,
                _this.widht/2, -0+0.1, -0,
            ];
        } 
        else if (_this.orientation === "bot"){
            vertices = [
                -_this.widht/2, 0-0.1, -0,
                -_this.widht/2, 0-0.1, 0.05,
                _this.widht/2, 0-0.1, 0.05,
                _this.widht/2, 0-0.1, -0,
                // Left
                -_this.widht/2, 0-0.1, 0.05,
                -_this.widht/2, -_this.lenght-0.1, 0.05,
                -_this.widht/2, -_this.lenght-0.1, -0,
                -_this.widht/2, 0-0.1, -0,
                // Right
                _this.widht/2, 0-0.1, 0.05,
                _this.widht/2, -_this.lenght-0.1, 0.05,
                _this.widht/2, -_this.lenght-0.1, -0,
                _this.widht/2, 0-0.1, -0,
                // Front
                _this.widht/2, 0-0.1, 0.05,
                _this.widht/2, -_this.lenght-0.1, 0.05,
                -_this.widht/2, -_this.lenght-0.1, 0.05,
                -_this.widht/2, 0-0.1, 0.05,
                // Back
                _this.widht/2, 0-0.1, -0,
                _this.widht/2, -_this.lenght-0.1, -0,
                -_this.widht/2, -_this.lenght-0.1, -0,
                -_this.widht/2, 0-0.1, -0,
                // Bottom
                -_this.widht/2, -_this.lenght-0.1, -0,
                -_this.widht/2, -_this.lenght-0.1, 0.05,
                _this.widht/2, -_this.lenght-0.1, 0.05,
                _this.widht/2, -_this.lenght-0.1, -0,
            ];
        }
        else if (_this.orientation === "left"){
            vertices = [
                -_this.lenght-0.1, _this.widht/2, -0,
                -_this.lenght-0.1, _this.widht/2, 0.05,
                0-0.1, _this.widht/2, 0.05,
                0-0.1, _this.widht/2, -0,
                // Left
                -_this.lenght-0.1, _this.widht/2, 0.05,
                -_this.lenght-0.1, -_this.widht/2, 0.05,
                -_this.lenght-0.1, -_this.widht/2, -0,
                -_this.lenght-0.1, _this.widht/2, -0,
                // Right
                0-0.1, _this.widht/2, 0.05,
                0-0.1, -_this.widht/2, 0.05,
                0-0.1, -_this.widht/2, -0,
                0-0.1, _this.widht/2, -0,
                // Front
                0-0.1, _this.widht/2, 0.05,
                0-0.1, -_this.widht/2, 0.05,
                -_this.lenght-0.1, -_this.widht/2, 0.05,
                -_this.lenght-0.1, _this.widht/2, 0.05,
                // Back
                0-0.1, _this.widht/2, -0,
                0-0.1, -_this.widht/2, -0,
                -_this.lenght-0.1, -_this.widht/2, -0,
                -_this.lenght-0.1, _this.widht/2, -0,
                // Bottom
                -_this.lenght-0.1, -_this.widht/2, -0,
                -_this.lenght-0.1, -_this.widht/2, 0.05,
                0-0.1, -_this.widht/2, 0.05,
                0-0.1, -_this.widht/2, -0,
            ];
        } 
        else if (_this.orientation === "right"){
            vertices = [
                _this.lenght+0.1, _this.widht/2, -0,
                _this.lenght+0.1, _this.widht/2, 0.05,
                0+0.1, _this.widht/2, 0.05,
                0+0.1, _this.widht/2, -0,
                // Left
                0+0.1, _this.widht/2, 0.05,
                0+0.1, -_this.widht/2, 0.05,
                0+0.1, -_this.widht/2, -0,
                0+0.1, _this.widht/2, -0,
                // Right
                _this.lenght+0.1, _this.widht/2, 0.05,
                _this.lenght+0.1, -_this.widht/2, 0.05,
                _this.lenght+0.1, -_this.widht/2, -0,
                _this.lenght+0.1, _this.widht/2, -0,
                // Front
                0+0.1, _this.widht/2, 0.05,
                0+0.1, -_this.widht/2, 0.05,
                _this.lenght+0.1, -_this.widht/2, 0.05,
                _this.lenght+0.1, _this.widht/2, 0.05,
                // Back
                0+0.1, _this.widht/2, -0,
                0+0.1, -_this.widht/2, -0,
                _this.lenght+0.1, -_this.widht/2, -0,
                _this.lenght+0.1, _this.widht/2, -0,
                // Bottom
                _this.lenght+0.1, -_this.widht/2, -0,
                _this.lenght+0.1, -_this.widht/2, 0.05,
                0+0.1, -_this.widht/2, 0.05,
                0+0.1, -_this.widht/2, -0,
            ];
        }

        indices = [
            // Top
            0, 1, 2,
            0, 2, 3,
            // Left
            5, 4, 6,
            6, 4, 7,
            // Right
            8, 9, 10,
            8, 10, 11,
            // Front
            13, 12, 14,
            15, 14, 12,
            // Back
            16, 17, 18,
            16, 18, 19,
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];
        
        _this.attributes.aPosition.bufferData = new Float32Array(vertices);
        _this.attributes.aNormal.bufferData = new Float32Array(vertices);
        _this.indices = new Uint8Array(indices);   
    
        var textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
  
            // Back face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
  
            // Top face
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
  
            // Bottom face
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
  
            // Right face
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
  
            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        _this.attributes.aTexCoord.bufferData = new Float32Array(textureCoords);

        _this.textureImg.onload = function(){
            _this.initTextures()
        }
        _this.textureImg.crossorigin = "anonymous";
        _this.textureImg.src = "rustedmetal2.jpg";
    }(this);

    this.initTextures = function(){
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImg);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.texture = texture;
    };

    this.calculateMatrix = function(mvp){
        var angle = performance.now() / 100 / 6 * 2 * Math.PI;
        var identityMatrix = new Float32Array(16);
        glMatrix.mat4.identity(identityMatrix);

        if (this.type === "rback"){
            var rotationY = new Float32Array(16);
            var rotationZ = new Float32Array(16);
            var translationX = glMatrix.vec3.create();
            var translationZ = glMatrix.vec3.create();
            
            glMatrix.mat4.rotate(rotationZ, identityMatrix, angle, [0, 0, 1]);
            glMatrix.mat4.rotate(rotationY, identityMatrix, Math.PI/2, [0, 1, 0]);
            glMatrix.mat4.mul(this.state.mm, rotationY, rotationZ);

            glMatrix.vec3.set (translationZ, 0, 0, 0.6);
            glMatrix.vec3.set (translationX, 0.05, 0, 0);
            glMatrix.mat4.translate (mvp, mvp, translationZ);
            glMatrix.mat4.translate (mvp, mvp, translationX);
        }
        else if (this.type === "rtop"){
            var rotationX = new Float32Array(16);
            var rotationZ = new Float32Array(16);

            glMatrix.mat4.rotate(rotationZ, identityMatrix, angle, [0, 0, 1]);
            glMatrix.mat4.rotate(rotationX, identityMatrix, Math.PI/2, [1, 0, 0]);
            glMatrix.mat4.mul(this.state.mm, rotationX, rotationZ);

            var translation = glMatrix.vec3.create();
            glMatrix.vec3.set (translation, 0, 0, -0.4);
            glMatrix.mat4.translate (this.state.mm, this.state.mm, translation);
        }
    };
    
    this.draw = function(gl){
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};