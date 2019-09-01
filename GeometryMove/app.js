
var state = {
    gl: null,
    animation: {},
    eye: {
        x:3.0,
        y:3.0,
        z:4.0,
    },
    objects: [],
    animate: true
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
        new Sphere(),
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
        mat4.copy(mvp, pm);
        mat4.multiply(mvp, mvp, vm);
        mat4.multiply(mvp, mvp, obj.state.mm);
        mat4.rotateX(mvp, mvp, 0.0);
        mat4.rotateY(mvp, mvp, 0.01);
        state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
        state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_BYTE, 0);
    });
}
