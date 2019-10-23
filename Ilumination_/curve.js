function Curve(bezierCurve) {
    this.bezier = bezierCurve;
    this.radius = 0.25;
    this.steps = 100;
    this.LUT = [];
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

    this.updateCurve = function(){
        var vertices = [], indices = [];

        this.LUT = this.bezier.getLUT(this.steps);

        for(i=0; i<this.steps;i++){
            vertices.push(this.LUT[i].x); //x
            vertices.push(this.LUT[i].y); //y
            vertices.push(this.LUT[i].z); //z
        }
        this.attributes.aPosition.bufferData = new Float32Array(vertices);
        for (j = 0; j < vertices.length/3; j++) {
            indices.push(j);
        }
        this.indices = new Uint8Array(indices);

        var selColor = [];
        for (j = 0; j <= vertices.length/3; j++) {
            selColor.push(this.selColor[0]);
            selColor.push(this.selColor[1]);
            selColor.push(this.selColor[2]);
            selColor.push(this.selColor[3]);
        }
        this.attributes.aColor.bufferData = new Float32Array(selColor);
    }
    // Initialization
    this.init = function(_this) {
        _this.updateCurve();
    }(this);

    this.calculateMatrix = function(mvp){
    }

    this.draw = function(gl){
        state.gl.drawElements(gl.LINE_STRIP, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }
};