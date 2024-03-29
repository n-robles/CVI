
var state = {
    gl: null,
    animation: {},
    eye: {
        x:12.0,
        y:15.0,
        z:12.0,
    },
    objects: [],
    animate: true,
    speed:1000,
    radius:5
};

var sliderSpeed = document.getElementById('speed');
var sliderDistance = document.getElementById('distance');

sliderSpeed.onchange = function() 
{
  state.speed = 10000/Number(sliderSpeed.value);
  animate();
}

sliderDistance.onchange = function() 
{
  state.radius = Number(sliderDistance.value);
  animate();
}

glUtils.SL.init({ callback:function() { main(); } });

function main() {
    state.canvas = document.getElementById("glcanvas");

    state.speed = 10000/Number(sliderSpeed.value);
    state.radius = Number(sliderDistance.value);

    state.gl = glUtils.checkWebGL(state.canvas, { preserveDrawingBuffer: true });
    initShaders();
    initGL();
    initState();
    draw();
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
    state.objects = [
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
        new Rectangle(2,0.25,"right","rtop"),
        new Cylinder("focus")
    ];
}

function animate() {
    state.animation.tick = function() {
        draw();
        requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
}

function draw(args) {
    const {width, height} = state.gl.canvas;
    const halfWidth = width/2;
    const halfHeight = height/2;
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    var vm = state.vm;
    var pm = state.pm;
    state.gl.viewport(0,0,halfWidth,height);
    var fov = 120 * Math.PI/180
    glMatrix.mat4.perspective(pm,
        fov, halfWidth/height, 1, 100
    );
    glMatrix.mat4.lookAt(vm,
        glMatrix.vec3.fromValues(state.eye.x,state.eye.y,state.eye.z),
        glMatrix.vec3.fromValues(1,0,0),
        glMatrix.vec3.fromValues(0,1,0)
    );

    drawScene(vm, pm);

    state.gl.viewport(halfWidth,halfHeight,halfWidth,halfHeight);
    fov = 120 * Math.PI/180
    glMatrix.mat4.perspective(pm,
        fov, halfWidth/halfHeight, 1, 100
    );
    glMatrix.mat4.lookAt(vm,
        glMatrix.vec3.fromValues(1,8,1),
        glMatrix.vec3.fromValues(1,0,0),
        glMatrix.vec3.fromValues(0,1,0)
    );

    drawScene(vm, pm);

    state.gl.viewport(halfWidth,0,halfWidth,halfHeight);
    fov = 100 * Math.PI/180
    glMatrix.mat4.perspective(pm,
        fov, halfWidth/halfHeight, 1, 100
    );
    glMatrix.mat4.lookAt(vm,
        glMatrix.vec3.fromValues(1,2,15),
        glMatrix.vec3.fromValues(1,0,0),
        glMatrix.vec3.fromValues(0,1,0)
    );

    drawScene(vm, pm);
}

function drawScene(cameraMatrix, worldMatrix){
    var mvp = state.mvp;
    var uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    // Loop through each object and draw!
    state.objects.forEach(function(obj) {
        state.program.renderBuffers(obj);
        
        glMatrix.mat4.copy(mvp, worldMatrix);
        glMatrix.mat4.multiply(mvp, mvp, cameraMatrix);
        obj.calculateMatrix(mvp, state.speed, state.radius);
        
        glMatrix.mat4.multiply(mvp, mvp, obj.state.mm);

        state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
        obj.draw(state.gl);
    });

}
