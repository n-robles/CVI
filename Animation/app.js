
var state = {
    gl: null,
    animation: {},
    eye: {
        x:3.0,
        y:3.0,
        z:7.0,
    },
    objects: [],
    curve: null,
    animate: true,
    time: 0.0,
    curvePos: 0.0,
    speed:1000,
    direction: true
};

var sliderSpeed = document.getElementById('speed');

var x1 = document.getElementById('point1x');
var y1 = document.getElementById('point1y');
var z1 = document.getElementById('point1z');

var x2 = document.getElementById('point2x');
var y2 = document.getElementById('point2y');
var z2 = document.getElementById('point2z');

var x3 = document.getElementById('point3x');
var y3 = document.getElementById('point3y');
var z3 = document.getElementById('point3z');

var x4 = document.getElementById('point4x');
var y4 = document.getElementById('point4y');
var z4 = document.getElementById('point4z');

sliderSpeed.onchange = function() 
{
  state.speed = 10000/Number(sliderSpeed.value);
  state.curvePos = 0.0;
  animate();
}

function calculateNewCurve(){
    state.curve = new Bezier([
        {x:Number(x1.value),y:Number(y1.value),z:Number(z1.value)},
        {x:Number(x2.value),y:Number(y2.value),z:Number(z2.value)},
        {x:Number(x3.value),y:Number(y3.value),z:Number(z3.value)},
        {x:Number(x4.value),y:Number(y4.value),z:Number(z4.value)}
    ]);
    state.curvePos = 0.0;
    animate();
}

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
        });
    });
}

setInputFilter(x1, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(x2, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(x3, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(x4, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(y1, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(y2, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(y3, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(y4, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(z1, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(z2, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(z3, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

setInputFilter(z4, function(value) {
    return /^-?\d*[.,]?\d*$/.test(value); });

glUtils.SL.init({ callback:function() { main(); } });

function main() {
    state.canvas = document.getElementById("glcanvas");

    state.speed = 10000/Number(sliderSpeed.value);

    state.gl = glUtils.checkWebGL(state.canvas, { preserveDrawingBuffer: true });
    initShaders();
    initGL();
    initState();
    var date = new Date();
    state.time = date.getTime();
    draw(0.0);
    if (state.animate) {
        animate();
    }
}

function initShaders() {
    var vertexShader = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.program = glUtils.createProgram(state.gl, vertexShader, fragmentShader);
}

function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.useProgram(state.program);
}

function initState() {
    state.vm = glMatrix.mat4.create();
    state.pm = glMatrix.mat4.create();
    state.mvp = glMatrix.mat4.create();
    state.curve = new Bezier([{x:-4,y:0,z:-4}, {x:-4,y:2,z:4}, {x:4,y:4,z:4}, {x:4,y:-4,z:-4}]);
    state.objects = [
        new Curve(state.curve),
        new Cylinder("tail"),
        new Circle(0.25,0.0),
        new Circle(0.25,2),
        new Sphere(),
        new Rectangle(0.5,0.15,"top","rback"),
        new Rectangle(0.5,0.15,"bot","rback"),
        new Rectangle(0.5,0.15,"left","rback"),
        new Rectangle(0.5,0.15,"right","rback"),
        new Rectangle(2,0.25,"top","rtop"),
        new Rectangle(2,0.25,"bot","rtop"),
        new Rectangle(2,0.25,"left","rtop"),
        new Rectangle(2,0.25,"right","rtop")
    ];
}

function animate() {
    state.animation.tick = function() {
        var date = new Date();
        var newTime = date.getTime();
        var dTime = newTime - state.time;
        draw(dTime);
        state.time = newTime;
        requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
}

function draw(time) {
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    var uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    var vm = state.vm;
    var pm = state.pm;
    var mvp = state.mvp;
    var fov = 120 * Math.PI/180
    glMatrix.mat4.perspective(pm,
        fov, state.canvas.width/state.canvas.height, 1, 100
    );
    glMatrix.mat4.lookAt(vm,
        glMatrix.vec3.fromValues(state.eye.x,state.eye.y,state.eye.z),
        glMatrix.vec3.fromValues(0,0,0),
        glMatrix.vec3.fromValues(0,1,0)
    );
    var tick = time/state.speed
    if (state.direction){
        state.curvePos += tick;
    }
    else{
        state.curvePos -= tick;
    }
    
    if (state.curvePos > 1){
        state.direction = false;
    }
    else if(state.curvePos < 0){
        state.direction = true;
    }
    var pos = state.curve.get(state.curvePos);
    var dv = state.curve.derivative(state.curvePos);
    // Loop through each object and draw!
    state.objects.forEach(function(obj) {
        if (obj.objType === "Curve" && (obj.bezier.toString() !== state.curve.toString())){
            obj.bezier = state.curve;
            obj.updateCurve();
        }
        state.program.renderBuffers(obj);

        glMatrix.mat4.copy(mvp, pm);
        glMatrix.mat4.multiply(mvp, mvp, vm);
        
        if (obj.objType !== "Curve"){
            //var translation = glMatrix.vec3.create();
            //glMatrix.vec3.set (translation, pos.x, pos.y, pos.z);
            //glMatrix.mat4.translate (mvp, mvp, translation);
            var lookAt = glMatrix.mat4.create();
            if (state.direction){
                glMatrix.mat4.targetTo(lookAt,
                    glMatrix.vec3.fromValues(pos.x, pos.y, pos.z),
                    glMatrix.vec3.fromValues(dv.x, dv.y, dv.z),
                    glMatrix.vec3.fromValues(0,1,0)
                );
                glMatrix.mat4.mul(mvp,mvp,lookAt);
            }
            else{
                glMatrix.mat4.targetTo(lookAt,
                    glMatrix.vec3.fromValues(pos.x, pos.y, pos.z),
                    glMatrix.vec3.fromValues(-dv.x, -dv.y, -dv.z),
                    glMatrix.vec3.fromValues(0,1,0)
                );
                glMatrix.mat4.mul(mvp,mvp,lookAt);
            }
            
        }
        obj.calculateMatrix(mvp);

        glMatrix.mat4.multiply(mvp, mvp, obj.state.mm);
        state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
        obj.draw(state.gl);
    });
}
