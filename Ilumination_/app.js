
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
    spawn: false,
    frameBuffer: null
};

var sliderSpeed = document.getElementById('speed');

sliderSpeed.onchange = function() 
{
  state.speed = 10000/Number(sliderSpeed.value);
  state.curvePos = 0.0;
  animate();
}

glUtils.SL.init({ callback:function() {
    state.frameBuffer = createShadowFrameBuffer(state.gl, 512, 512);
     main(); 
    } });

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
    var shadowVertex = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
        ShadowFragment = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
    state.shadowProgram = glUtils.createProgram(state.gl, shadowVertex, ShadowFragment);
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

    state.shadowMvp = glMatrix.mat4.create();
    state.shadowVm = glMatrix.mat4.create();
    state.shadowPm = glMatrix.mat4.create();


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
    var uShadowSampler = state.gl.getUniformLocation(state.program, 'uShadowSampler');
    var uModelMatrix = state.gl.getUniformLocation(state.program, 'uModelMatrix');
    var shadowMapTransform = state.gl.getUniformLocation(state.program, 'uShadowMapTransformMatrix');

    //var shadowMapTransform = state.gl.getUniformLocation(state.shadowProgram, 'uShadowMapTransformMatrix');
    var uMVPMatrixS = state.gl.getUniformLocation(state.shadowProgram, 'uMVPMatrix');

    var vm = state.vm;
    var pm = state.pm;
    var mvp = state.mvp;

    var smvp = state.shadowMvp;
    var svm = state.shadowVm;
    var spm = state.shadowPm;

    var angleLight = performance.now() / state.speed / 6 * 2 * Math.PI;
    var angleSun = performance.now() / (state.speed * 2) / 6 * 2 * Math.PI;

    var fov = 120 * Math.PI/180
    glMatrix.mat4.perspective(pm,
        fov, state.canvas.width/state.canvas.height, 1, 100
    );
    glMatrix.mat4.perspective(spm,
        fov, 512/512, 1, 100
    );
    glMatrix.mat4.lookAt(vm,
        glMatrix.vec3.fromValues(state.eye.x,state.eye.y,state.eye.z),
        glMatrix.vec3.fromValues(0,0,0),
        glMatrix.vec3.fromValues(0,1,0)
    );

    glMatrix.mat4.lookAt(svm,
        glMatrix.vec3.fromValues(Math.cos(angleSun)*6.5, 0, Math.sin(angleSun)*6.5),
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

    glMatrix.mat4.copy(smvp, spm);
    glMatrix.mat4.multiply(smvp, smvp, svm);

    renderShadow(uMVPMatrixS, angleLight, angleSun, smvp);

    state.gl.useProgram(state.program);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.viewport(0, 0, state.canvas.width, state.canvas.height);

    state.gl.uniformMatrix4fv(shadowMapTransform, false, smvp);

   state.gl.bindFramebuffer(state.gl.FRAMEBUFFER,  null);
    
    // Loop through each object and draw!
    state.objects.forEach(function(obj) {
        state.program.renderBuffers(obj);

        glMatrix.mat4.copy(mvp, pm);
        glMatrix.mat4.multiply(mvp, mvp, vm);
        
        if (obj.role === "plane"){
            updateHelicopter(mvp, angleLight);
            state.gl.uniform3f(uMovingLight, Math.cos(angleLight)*3.5, 0, Math.sin(angleLight)*3.5);//move light
        }
        else if(obj.role === "sun"){
            updateSun(mvp, angleSun);
            state.gl.uniform3f(uSunLightPosition, Math.cos(angleSun)*8, 0, Math.sin(angleSun)*8);//move sun
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

        
            state.gl.activeTexture(state.gl.TEXTURE1);
            state.gl.bindTexture(state.gl.TEXTURE_2D, state.frameBuffer);
            state.gl.uniform1i(uShadowSampler, 1);
        

        obj.draw(state.gl);
    });
}

function updateHelicopter(mvp, angle){
    var lookAt = glMatrix.mat4.create();

    glMatrix.mat4.targetTo(lookAt,
        //glMatrix.vec3.fromValues(pos.x, pos.y, pos.z),
        //glMatrix.vec3.fromValues(dv.x, dv.y, dv.z),
        glMatrix.vec3.fromValues(Math.cos(angle)*3.5, 0, Math.sin(angle)*3.5),
        glMatrix.vec3.fromValues(0.5, 0, 0),
        glMatrix.vec3.fromValues(0,1,0)
    );
    glMatrix.mat4.mul(mvp,mvp,lookAt);
    
}

function updateSun(mvp, angle){
    var lookAt = glMatrix.mat4.create();

    glMatrix.mat4.targetTo(lookAt,
        //glMatrix.vec3.fromValues(pos.x, pos.y, pos.z),
        //glMatrix.vec3.fromValues(dv.x, dv.y, dv.z),
        glMatrix.vec3.fromValues(Math.cos(angle)*8, 0, Math.sin(angle)*8),
        glMatrix.vec3.fromValues(0.5, 0, 0),
        glMatrix.vec3.fromValues(0,1,0)
    );
    glMatrix.mat4.mul(mvp,mvp,lookAt);
    
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

function renderShadow(uMVPMatrix, angle1, angle2, smvp){  
    state.gl.useProgram(state.shadowProgram);
    var mvp = glMatrix.mat4.create();
    glMatrix.mat4.copy(mvp, smvp);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.viewport(0, 0, 512, 512);

    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER,  state.frameBuffer);
    state.objects.forEach(function(obj) {
        state.shadowProgram.renderBuffers(obj);
        
        if (obj.role === "plane"){
            updateHelicopter(mvp, angle1);
        }
        else if(obj.role === "sun"){
            updateSun(mvp, angle2);
        }
        else if (obj.role === "mars"){
            updatePlanet(mvp);
        }
        else{
            //updateLanding(mvp, obj, uStaticLight);
        }

        obj.calculateMatrix(mvp);

        glMatrix.mat4.multiply(mvp, mvp, obj.state.mm);
        state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
        
        obj.draw(state.gl);
    });
}

function createShadowFrameBuffer(gl, width, height) {
    let frame_buffer, color_buffer, depth_buffer, status;

    // Check for errors and report appropriate error messages
    function _errors(buffer, buffer_name) {
      let error_name = state.gl.getError();
      if (!buffer || error_name !==state.gl.NO_ERROR) {
        window.console.log("Error in _createFrameBufferObject,", buffer_name, "failed; ", error_name);

        // Reclaim any buffers that have already been allocated
       state.gl.deleteTexture(color_buffer);
       state.gl.deleteFramebuffer(frame_buffer);

        return true;
      }
      return false;
    }

    // Step 1: Create a frame buffer object
    frame_buffer =state.gl.createFramebuffer();
    if (_errors(frame_buffer, "frame buffer")) { return null; }

    // Step 2: Create and initialize a texture buffer to hold the colors.
    color_buffer =state.gl.createTexture();
    if (_errors(color_buffer, "color buffer")) { return null; }
   state.gl.bindTexture(state.gl.TEXTURE_2D, color_buffer);
   state.gl.texImage2D(state.gl.TEXTURE_2D, 0,state.gl.RGBA, width, height, 0,
     state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);
    if (_errors(color_buffer, "color buffer allocation")) { return null; }
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_MIN_FILTER,state.gl.LINEAR);
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_MAG_FILTER,state.gl.LINEAR);
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_WRAP_S,state.gl.CLAMP_TO_EDGE);
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_WRAP_T,state.gl.CLAMP_TO_EDGE);

    // Step 3: Create and initialize a texture buffer to hold the depth values.
    // Note: the WEBGL_depth_texture extension is required for this to work
    //       and for thestate.gl.DEPTH_COMPONENT texture format to be supported.
    var ext = gl.getExtension('WEBGL_depth_texture');
    depth_buffer =state.gl.createTexture();
    if (_errors(depth_buffer, "depth buffer")) { return null; }
   state.gl.bindTexture(state.gl.TEXTURE_2D, depth_buffer);
   state.gl.texImage2D(state.gl.TEXTURE_2D, 0,state.gl.DEPTH_COMPONENT, width, height, 0,
     state.gl.DEPTH_COMPONENT,state.gl.UNSIGNED_INT, null);
    if (_errors(depth_buffer, "depth buffer allocation")) { return null; }
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_MIN_FILTER,state.gl.LINEAR);
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_MAG_FILTER,state.gl.LINEAR);
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_WRAP_S,state.gl.CLAMP_TO_EDGE);
   state.gl.texParameteri(state.gl.TEXTURE_2D,state.gl.TEXTURE_WRAP_T,state.gl.CLAMP_TO_EDGE);

    // Step 4: Attach the specific buffers to the frame buffer.
   state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, frame_buffer);
   state.gl.framebufferTexture2D(state.gl.FRAMEBUFFER,state.gl.COLOR_ATTACHMENT0,state.gl.TEXTURE_2D, color_buffer, 0);
   state.gl.framebufferTexture2D(state.gl.FRAMEBUFFER,state.gl.DEPTH_ATTACHMENT,state.gl.TEXTURE_2D, depth_buffer, 0);
    if (_errors(frame_buffer, "frame buffer")) { return null; }

    // Step 5: Verify that the frame buffer is valid.
    status =state.gl.checkFramebufferStatus(state.gl.FRAMEBUFFER);
    if (status !==state.gl.FRAMEBUFFER_COMPLETE) {
      _errors(frame_buffer, "frame buffer status:" + status.toString());
    }

    // Unbind these new objects, which makes the default frame buffer the 
    // target for rendering.
   state.gl.bindTexture(state.gl.TEXTURE_2D, null);
   state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, null);

    // Remember key properties of the frame buffer object so they can be
    // used later.
    frame_buffer.color_buffer = color_buffer;
    frame_buffer.depth_buffer = depth_buffer;
    frame_buffer.width = width;
    frame_buffer.height = height;
    return frame_buffer;
  }