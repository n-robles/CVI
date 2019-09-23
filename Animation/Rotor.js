// Create a rotor
function Rectangle(lenght, widht, orientation, type) {
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
    this.role = "body";
    this.selColor = [0.2,0.15,0.3,1.0];
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
    _this.indices = new Uint8Array(indices);

    // Selection color
    var selColor = [];
    for (j = 0; j <= indices.length; j++) {
        selColor.push(_this.selColor[0]);
        selColor.push(_this.selColor[1]);
        selColor.push(Math.random() * (1 - _this.selColor[2]) + _this.selColor[2]);
        selColor.push(_this.selColor[3]);
    }
    _this.attributes.aColor.bufferData = new Float32Array(selColor);    
    
    }(this);

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

            glMatrix.vec3.set (translationZ, 0, 0, 2.75);
            glMatrix.vec3.set (translationX, 0.25, 0, 0);
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
            glMatrix.vec3.set (translation, 0, 0, -1.65);
            glMatrix.mat4.translate (this.state.mm, this.state.mm, translation);
        }
    };
    
    this.draw = function(gl){
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};