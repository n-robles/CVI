attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uMVPMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
//varying vec4 vColor;

void main() {
  gl_Position = uMVPMatrix * aPosition;
  // Calculate the vertex position in the world coordinate
  vPosition = vec3(uModelMatrix * aPosition);
  vNormal = normalize(vec3(uNormalMatrix * aNormal));
  vTexCoord = aTexCoord;
}