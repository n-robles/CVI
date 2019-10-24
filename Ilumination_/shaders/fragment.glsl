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
  vec3 lightDirectionSun = normalize(uLightPosition - vPosition);
  vec3 lightDirectionStatic = normalize(uLightPosition1 - vPosition);
  vec3 lightDirectionMovil = normalize(uLightPosition2 - vPosition);
   // The dot product of the light direction and the normal
  float nDotSun = max(dot(lightDirectionSun, normal), 0.0);
  float nDotSt = max(dot(lightDirectionStatic, normal), 0.0);
  float nDotM = max(dot(lightDirectionMovil, normal), 0.0);
   // Calculate the final color from diffuse reflection and ambient reflection
  vec3 diffuse = uLightColor * color.rgb * nDotSun;
  vec3 diffuse1 = uLightColor * color.rgb * nDotSt;
  vec3 diffuse2 = uLightColor * color.rgb * nDotM;
  vec3 ambient = uAmbientLight * color.rgb;
  gl_FragColor = vec4(diffuse + ambient + diffuse2 + diffuse1, color.a);
}