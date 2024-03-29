precision mediump int;
precision highp float;

attribute vec4 aPosition;

uniform mat4 uMVPMatrix;

void main() {
  gl_Position = uMVPMatrix * aPosition;
}