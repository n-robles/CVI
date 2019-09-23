// Create a cylinder
function Cylinder(type = "") {
    this.height = 2;
    this.radius = 0.25;
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
    this.objType = "Cylinder";
    this.role = type;
    this.state = {
        mm: glMatrix.mat4.create(),
        nm: null,
    };    
    
    this.selColor = [0.1,0.01,0.1,1.0];
    this.stride = 0;

    this.topFace = null;
    this.botomFace = null;

    // Initialization
    this.init = function(_this) {
        var SPHERE_DIV = 12;
        var j, aj, sj, cj;
        var step = 360 / SPHERE_DIV;
        aj = step;

        // Vertices
        var vertices = [], indices = [];
        for (j = 0; j <= 360; j += step) {
            aj = j * Math.PI / 180;
            sj = _this.radius * Math.sin(aj);
            cj = _this.radius * Math.cos(aj);

            vertices.push(cj); //x
            vertices.push(sj);//y
            vertices.push(0.0); //z

            vertices.push(cj); //x
            vertices.push(sj);//y
            vertices.push(_this.height); //z
        }
        
        _this.attributes.aPosition.bufferData = new Float32Array(vertices);
        // Indices
        for (j = 0; j < vertices.length/3; j++) {
            indices.push(j);
        }
        indices.push(1);
        indices.push(2);
        _this.indices = new Uint8Array(indices);

        // Selection color
        var selColor = [];
        for (j = 0; j <= vertices.length/3; j++) {
            selColor.push(_this.selColor[0]);
            selColor.push(Math.random() * (1 - _this.selColor[1]) + _this.selColor[1]);
            selColor.push(_this.selColor[2]);
            selColor.push(_this.selColor[3]);
        }
        _this.attributes.aColor.bufferData = new Float32Array(selColor);
    }(this);

    this.calculateMatrix = function(mvp){
        var translation = glMatrix.vec3.create();
        glMatrix.vec3.set (translation, 0, -0.2, 1);
        glMatrix.mat4.translate (mvp, mvp, translation);
    };

    this.draw = function(gl){
        state.gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }
};

function Circle(radius, height){
    this.radius = radius;
    this.height = height;
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
    this.objType = "Circle";
    this.role = "body";
    this.indices = null;
    this.state = {
        mm: glMatrix.mat4.create(),
        nm: null,
    };
    
    this.selColor = [0.2,0.3,0.6,1.0];
    this.stride = 0;

    // Initialization
    this.init = function(_this) {
        var circleSegment = 12;
        var j, aj, sj, cj, tm = 0;
        var step = 360 / circleSegment;
        aj = step;

        // Vertices
        var vertices = [], indices = [];
        vertices.push(0.0); //x
        vertices.push(0.0);//y
        vertices.push(_this.height); //z
        for (j = 0; j <= 360; j+=step) {
            aj = j * Math.PI / 180;
            sj = _this.radius * Math.sin(aj);
            cj = _this.radius * Math.cos(aj);

            vertices.push(cj); //x
            vertices.push(sj);//y
            vertices.push(_this.height); //z
        }
        _this.attributes.aPosition.bufferData = new Float32Array(vertices);
        // Indices
        for (j = 0; j < circleSegment; j++) {
            indices.push(j);
        }
        indices.push(1);
        _this.indices = new Uint8Array(indices);

        // Selection color
        var selColor = [];
        for (j = 0; j <= circleSegment; j++) {
            selColor.push(_this.selColor[0]);
            selColor.push(_this.selColor[1]);
            selColor.push(Math.random() * (1 - _this.selColor[2]) + _this.selColor[2]);
            selColor.push(_this.selColor[3]);
        }
        _this.attributes.aColor.bufferData = new Float32Array(selColor);
    }(this);

    this.calculateMatrix = function(mvp){
        var translation = glMatrix.vec3.create();
        glMatrix.vec3.set (translation, 0, -0.2, 1);
        glMatrix.mat4.translate (mvp, mvp, translation);
    };

    this.draw = function(gl){
        state.gl.drawElements(gl.TRIANGLE_FAN, this.indices.length, gl.UNSIGNED_BYTE, 0);
    };
};