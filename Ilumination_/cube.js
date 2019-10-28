// Create a Building
function Cube(side, gl, pos, hasLight) {
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
    this.side = side/2;
    this.indices = null;
    this.state = {
        mm: glMatrix.mat4.create(),
        nm: null,
    };
    this.objType = "Cube";
    this.role = "building";
    this.stride = 0;
    this.pos = pos;
    this.hasLight = hasLight;

    // Initialization
    this.init = function(_this) {
        var vertices = [], indices = [], normal=[];
        vertices = [
            // Front face
            -_this.side, -_this.side, _this.side,
            _this.side, -_this.side, _this.side,
            _this.side, _this.side, _this.side,
            -_this.side, _this.side, _this.side,
    
            // Back face
            -_this.side, -_this.side, -_this.side,
            -_this.side, _this.side, -_this.side,
            _this.side, _this.side, -_this.side,
            _this.side, -_this.side, -_this.side,
    
            // Top face
            -_this.side, _this.side, -_this.side,
            -_this.side, _this.side, _this.side,
            _this.side, _this.side, _this.side,
            _this.side, _this.side, -_this.side,
    
            // Bottom face
            -_this.side, -_this.side, -_this.side,
            _this.side, -_this.side, -_this.side,
            _this.side, -_this.side, _this.side,
            -_this.side, -_this.side, _this.side,
    
            // Right face
            _this.side, -_this.side, -_this.side,
            _this.side, _this.side, -_this.side,
            _this.side, _this.side, _this.side,
            _this.side, -_this.side, _this.side,
    
            // Left face
            -_this.side, -_this.side, -_this.side,
            -_this.side, -_this.side, _this.side,
            -_this.side, _this.side, _this.side,
            -_this.side, _this.side, -_this.side,
        ];

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

        normal = [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
    
            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
    
            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
    
            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
    
            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
    
            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ];
        
        _this.attributes.aPosition.bufferData = new Float32Array(vertices);
        _this.attributes.aNormal.bufferData = new Float32Array(normal);
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
        _this.textureImg.src = "bricks.jpg";
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
        glMatrix.mat4.translate (mvp, mvp, pos);
    };
    
    this.draw = function(gl){
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};