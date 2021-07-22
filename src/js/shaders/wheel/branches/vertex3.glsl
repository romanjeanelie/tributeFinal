attribute float aRandom; 

varying vec2 vUv; 
varying float vRandom; 

uniform float uPixelRatio; 


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;  

    // gl_PointSize = 7.0;
      gl_PointSize = max(30000., uPixelRatio * 1000.);

    // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);


    vUv = uv; 
    vRandom = aRandom;
}
