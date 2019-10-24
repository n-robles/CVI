
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
    spawn: false
};

var sliderSpeed = document.getElementById('speed');

sliderSpeed.onchange = function() 
{
  state.speed = 10000/Number(sliderSpeed.value);
  state.curvePos = 0.0;
  animate();
}

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
    state.curve = new Bezier([{x:0,y:0,z:4}, {x:-4,y:0,z:0}, {x:0,y:0,z:-4}, {x:4,y:0,z:0}]);
    state.objects = [
        new Cylinder("plane", state.gl),
        new Sphere(state.gl, 3.0, "WORLD", "mars"),//planeta
        new Sphere(state.gl, 0.5, "SUN", "sun"),//sol
        new Sphere(state.gl, 0.25, "MODEL", "plane"),//nave
        new Rectangle(0.15,0.05,"top","rback", state.gl, "plane"),
        new Rectangle(0.15,0.05,"bot","rback", state.gl, "plane"),
        new Rectangle(0.15,0.05,"left","rback", state.gl, "plane"),
        new Rectangle(0.15,0.05,"right","rback", state.gl, "plane"),
        new Rectangle(0.5,0.05,"top","rtop", state.gl, "plane"),
        new Rectangle(0.5,0.05,"bot","rtop", state.gl, "plane"),
        new Rectangle(0.5,0.05,"left","rtop", state.gl, "plane"),
        new Rectangle(0.5,0.05,"right","rtop", state.gl, "plane")
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
    var uNormalMatrix = state.gl.getUniformLocation(state.program, 'uNormalMatrix');
    var uLightColor = state.gl.getUniformLocation(state.program, 'uLightColor');
    var uSunLightPosition = state.gl.getUniformLocation(state.program, 'uLightPosition');
    var uStaticLight = state.gl.getUniformLocation(state.program, 'uLightPosition1');
    var uMovingLight = state.gl.getUniformLocation(state.program, 'uLightPosition2');
    var uAmbientLight = state.gl.getUniformLocation(state.program, 'uAmbientLight');
    var uSampler = state.gl.getUniformLocation(state.program, 'uSampler');
    var uModelMatrix = state.gl.getUniformLocation(state.program, 'uModelMatrix');
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
    // Set the light color
    state.gl.uniform3f(uLightColor, 1.2, 1.2, 0.0);
    // Set the ambient light
    state.gl.uniform3f(uAmbientLight, 0.2, 0.2, 0.2);
    var tick = time/state.speed
    state.curvePos += tick;
    
    if (state.curvePos > 1){
        state.spawn = true;
        state.curvePos = 0;
    }    
    
    // Loop through each object and draw!
    state.objects.forEach(function(obj) {
        if (obj.objType === "Curve" && (obj.bezier.toString() !== state.curve.toString())){
            obj.bezier = state.curve;
            obj.updateCurve();
        }
        state.program.renderBuffers(obj);

        glMatrix.mat4.copy(mvp, pm);
        glMatrix.mat4.multiply(mvp, mvp, vm);
        
        if (obj.role === "plane"){
            updateHelicopter(mvp, uMovingLight);
        }
        else if(obj.role === "sun"){
            updateSun(mvp, uSunLightPosition);
        }
        else if (obj.role === "mars"){
            updatePlanet(mvp);
        }
        else{
            updateLanding(mvp, obj, uStaticLight);
        }

        obj.calculateMatrix(mvp);

        glMatrix.mat4.multiply(mvp, mvp, obj.state.mm);
        state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
        
        state.gl.uniformMatrix4fv(uModelMatrix, false, obj.state.mm);
        var normalMatrix = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMatrix, obj.state.mm);
        glMatrix.mat4.transpose(normalMatrix, normalMatrix);
        state.gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);

        // Bind the texture
        state.gl.activeTexture(state.gl.TEXTURE0);
        state.gl.bindTexture(state.gl.TEXTURE_2D, obj.texture);
        state.gl.uniform1i(uSampler, 0);

        obj.draw(state.gl);
    });
}

function updateHelicopter(mvp, uMovingLight){
    var pos = state.curve.get(state.curvePos);
    var dv = state.curve.derivative(state.curvePos);
    var lookAt = glMatrix.mat4.create();

    var angle = performance.now() / state.speed / 6 * 2 * Math.PI;

    glMatrix.mat4.targetTo(lookAt,
        //glMatrix.vec3.fromValues(pos.x, pos.y, pos.z),
        //glMatrix.vec3.fromValues(dv.x, dv.y, dv.z),
        glMatrix.vec3.fromValues(Math.cos(angle)*3.5, 0, Math.sin(angle)*3.5),
        glMatrix.vec3.fromValues(0.5, 0, 0),
        glMatrix.vec3.fromValues(0,1,0)
    );
    glMatrix.mat4.mul(mvp,mvp,lookAt);
    state.gl.uniform3f(uMovingLight, Math.cos(angle)*3.5, 0, Math.sin(angle)*3.5);//move light
}

function updateSun(mvp, uSunLightPosition){
    var lookAt = glMatrix.mat4.create();
    var angle = performance.now() / (state.speed * 2) / 6 * 2 * Math.PI;

    glMatrix.mat4.targetTo(lookAt,
        //glMatrix.vec3.fromValues(pos.x, pos.y, pos.z),
        //glMatrix.vec3.fromValues(dv.x, dv.y, dv.z),
        glMatrix.vec3.fromValues(Math.cos(angle)*8, 0, Math.sin(angle)*8),
        glMatrix.vec3.fromValues(0.5, 0, 0),
        glMatrix.vec3.fromValues(0,1,0)
    );
    glMatrix.mat4.mul(mvp,mvp,lookAt);
    state.gl.uniform3f(uSunLightPosition, Math.cos(angle)*8, 0, Math.sin(angle)*8);//move sun
}

function updatePlanet(mvp){
    if (state.spawn){
        spawnBuilding();
        state.spawn = false;
    }
}

function updateLanding(mvp, obj, uStaticLight){
    if (obj.hasLight){
        state.gl.uniform3f(uStaticLight, obj.pos[0], obj.pos[1], obj.pos[2]);
    }
}

function spawnBuilding(){
    var angle1, angle2;
    var rdn1, rdn2;
    var x, y, z;
    var hasLight = true;

    rdn1 = Math.random() * 2;
    rdn1 = rdn1 > 1 ? 1 : rdn1;
    rdn2 = Math.random() * 2;
    rdn2 = rdn2 > 1 ? 1 : rdn2;
    //hasLight = (Math.floor(Math.random() * 2) == 1) ? true : false;

    angle1 = Math.acos((2 * rdn1) - 1) - (Math.PI/2);
    angle2 = 2 * Math.PI * rdn2;

    x = 3 * (Math.cos(angle1) * Math.cos(angle2));
    y = 3 * (Math.cos(angle1) * Math.sin(angle2));
    z = 3 * Math.sin(angle1);
    
    var pos = glMatrix.vec3.fromValues(x,y,z);
    hasLight
    state.objects.push(new Cube(0.5,state.gl, pos, hasLight));
}