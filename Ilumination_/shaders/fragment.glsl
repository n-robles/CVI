precision mediump float;

uniform vec3 uLightColor;
uniform vec3 uLightPosition;
uniform vec3 uLightPosition1;
uniform vec3 uLightPosition2;
uniform vec3 uAmbientLight;
uniform sampler2D uSampler;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
void main() {
  vec4 color = texture2D(uSampler, vTexCoord);
   // Normalize the normal because it is interpolated and not 1.0 in length any more
  vec3 normal = normalize(vNormal);
   // Calculate the light direction and make it 1.0 in length
  vec3 lightDirection = normalize(uLightPosition - vPosition);
   // The dot product of the light direction and the normal
  float nDotL = max(dot(lightDirection, normal), 0.0);
   // Calculate the final color from diffuse reflection and ambient reflection
  vec3 diffuse = uLightColor * color.rgb * nDotL;
  vec3 ambient = uAmbientLight * color.rgb;
  gl_FragColor = vec4(diffuse + ambient, color.a);
}