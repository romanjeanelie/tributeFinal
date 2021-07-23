attribute float aRandom; 

varying vec2 vUv; 
varying float vOpacity; 

uniform float uPixelRatio; 


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;  

    // gl_PointSize = 7.0;
    gl_PointSize = max(30000., uPixelRatio * 10000.);

    // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);


    vUv = uv; 
    // vOpacity = aRandom;
}
 