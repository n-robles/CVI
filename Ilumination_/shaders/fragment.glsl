precision mediump float;

uniform vec3 uLightColor;
uniform vec3 uLightPosition;
uniform vec3 uLightPosition1;
uniform vec3 uLightPosition2;
uniform vec3 uAmbientLight;
uniform sampler2D uSampler;
uniform sampler2D uShadowSampler;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec4 vVertexRelativeToLight;

bool in_shadow(void) {
  vec3 vertex_relative_to_light = vVertexRelativeToLight.xyz / vVertexRelativeToLight.w;
  vertex_relative_to_light = vertex_relative_to_light * 0.5 + 0.5;
  vec4 shadowmap_color = texture2D(uShadowSampler, vertex_relative_to_light.xy);
  float shadowmap_distance = shadowmap_color.r;

  if ( vertex_relative_to_light.z <= shadowmap_distance + 0.00004 ) {
    return false; 
  } else {
    return true;
  }
}

void main() {
  vec4 color = texture2D(uSampler, vTexCoord);
   // Normalize the normal because it is interpolated and not 1.0 in length any more
  vec3 normal = normalize(vNormal);

  vec3 lightWeighting =  uAmbientLight;

  if(in_shadow()){
    lightWeighting = vec3(0.2, 0.2, 0.2);
  }

   // Calculate the light direction and make it 1.0 in length
  vec3 lightDirectionSun = normalize(uLightPosition - vPosition);
  vec3 lightDirectionStatic = normalize(uLightPosition1 - vPosition);
  vec3 lightDirectionMovil = normalize(uLightPosition2 - vPosition);
   // The dot product of the light direction and the normal
  float nDotSun = max(dot(lightDirectionSun, normal), 0.0);
  float nDotSt = max(dot(lightDirectionStatic, normal), 0.0);
  float nDotM = max(dot(lightDirectionMovil, normal), 0.0);

  float distance1 = length(vSurfaceToLight1);
  float distance2 = length(vSurfaceToLight2);
  float distance3 = length(vSurfaceToLight3);
   // Calculate the final color from diffuse reflection and ambient reflection
  vec3 diffuse = uLightColor * color.rgb * nDotSun;
  vec3 diffuse1 = uLightColor * color.rgb * nDotSt;
  vec3 diffuse2 = uLightColor * color.rgb * nDotM;
  vec3 ambient = uAmbientLight * color.rgb;

  float weight1 = max(dot(vTransformedNormal.xyz, lightDirectionSun), 0.0)/(distance1*24.0);
  float weight2 = max(dot(vTransformedNormal.xyz, lightDirectionMovil), 0.0)/(distance2*24.0);
  float weight3 = max(dot(vTransformedNormal.xyz, lightDirectionStatic), 0.0)/(distance3*12.0);

  if(distance1 > 0.0 && distance1 < 0.15){
    lightWeighting +=  directionalLightColor * weight1;
  }
  if(distance2 > 0.0 && distance2 < 0.15){
    lightWeighting +=  directionalLightColor * weight2;
  }
  if(distance3 > 0.0 && distance3 < 0.25){
    lightWeighting += directionalLightColor * weight3;
  }
  gl_FragColor = vec4(diffuse + lightWeighting +
   diffuse2 + diffuse1, color.a);
}