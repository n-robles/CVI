
var state = {
    gl: null,
    animation: {},
    eye: {
        x:3.0,
        y:3.0,
        z:4.0,
    },
    objects: [],
    animate: true,
    maxMove:20,
    step:0,
    resta:false
};

glUtils.SL.init({ callback:function() { main(); } });

function main() {
    state.canvas = document.getElementById("glcanvas");
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
    state.vm = mat4.create();
    state.pm = mat4.create();
    state.mvp = mat4.create();
    state.objects = [
        new Cylinder(),
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
        draw();
        requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
}

function draw(args) {
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    var uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    var vm = state.vm;
    var pm = state.pm;
    var mvp = state.mvp;
    mat4.perspective(pm,
        20, state.canvas.width/state.canvas.height, 1, 100
    );
    mat4.lookAt(vm,
        vec3.fromValues(state.eye.x,state.eye.y,state.eye.z),
        vec3.fromValues(0,0,0),
        vec3.fromValues(0,1,0)
    );

    // Loop through each object and draw!
    state.objects.forEach(function(obj) {
        state.program.renderBuffers(obj);
        
        var n = obj.indices.length;
        
        var translation = vec3.create();
        if (state.step >= state.maxMove && !state.resta){
            state.resta = true;
        }
        else if (state.step <= 0 && state.resta){
            state.resta = false
        }
        if (state.resta){
            state.step -= 0.001;
        }
        else{
            state.step += 0.001;
        }
        if (obj.objType === "Rectangle" && obj.type==="rback"){
            vec3.set (translation, 0, state.step, 0.0);
        }
        else{
            vec3.set (translation, 0, state.step, 0.0);
        }
        
        mat4.copy(mvp, pm);
        mat4.multiply(mvp, mvp, vm);
        mat4.translate (mvp, mvp, translation);
        obj.calculateMatrix(mvp);
        mat4.multiply(mvp, mvp, obj.state.mm);
        state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
        obj.draw(state.gl);
    });
}
