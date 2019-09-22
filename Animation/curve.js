function Curve(bezierCurve) {
    this.bezier = bezierCurve;
    this.radius = 0.25;
    this.steps = 100;
    this.LUT = bezierCurve.getLUT(this.steps);
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
    this.objType = "Curve";
    this.role = "curve";
    this.state = {
        mm: glMatrix.mat4.create(),
        nm: null,
    };
    this.stride = 0;
    this.selColor = [0.9,0.9,0.9,1.0];

    this.topFace = null;
    this.botomFace = null;

    // Initialization
    this.init = function(_this) {
        var vertices = [], indices = [];

        for(i=0; i<_this.steps;i++){
            vertices.push(_this.LUT[i].x); //x
            vertices.push(_this.LUT[i].y); //y
            vertices.push(_this.LUT[i].z); //z
        }
        _this.attributes.aPosition.bufferData = new Float32Array(vertices);
        for (j = 0; j < vertices.length/3; j++) {
            indices.push(j);
        }
        _this.indices = new Uint8Array(indices);

        var selColor = [];
        for (j = 0; j <= vertices.length/3; j++) {
            selColor.push(_this.selColor[0]);
            selColor.push(_this.selColor[1]);
            selColor.push(_this.selColor[2]);
            selColor.push(_this.selColor[3]);
        }
        _this.attributes.aColor.bufferData = new Float32Array(selColor);
    }(this);

    this.calculateMatrix = function(mvp, speed, radius){
    }

    this.draw = function(gl){
        state.gl.drawElements(gl.LINE_STRIP, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }

    this.updateCurve = function(){

    }
};