var vertexShaderSource = `#version 300 es

precision mediump float;

in vec3 aPosition;
in vec3 aColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

out vec3 vColor;

void main() {
    gl_Position = mProj * mView * mWorld * vec4(aPosition, 1.0);
    vColor = aColor;
}
`;

var fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}
`;

var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 2.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 2.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 2.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 2.0, -1.0,    0.5, 0.5, 0.5,
		// Left
		-1.0, 2.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -2.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -2.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 2.0, -1.0,   0.75, 0.25, 0.5,
		// Right
		1.0, 2.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -2.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -2.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 2.0, -1.0,   0.25, 0.25, 0.75,
		// Front
		1.0, 2.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -2.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -2.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 2.0, 1.0,    1.0, 0.0, 0.15,
		// Back
		1.0, 2.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -2.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -2.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 2.0, -1.0,    0.0, 1.0, 0.15,
		// Bottom
		-1.0, -2.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -2.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -2.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -2.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
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

var gl;

var InitDemo = function () {
	var canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl2');

	if (!gl) {
		console.log('WebGL2 no soportado');
		return;
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.shaderSource(fragmentShader, fragmentShaderSource);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	initGeometry(program)

	drawSceen(program);
};

function initGeometry(program)
{
	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'aPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'aColor');
	gl.vertexAttribPointer(
		positionAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
}

function drawSceen(program)
{
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
}