attribute float index; 
attribute float aRandom; 

varying float vRandom; 
varying vec2 vUv; 
varying float vIndex;  


uniform float uPixelRatio; 

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;  


    gl_PointSize = max(12000.0 * (1. + index), uPixelRatio * 1000.);

    // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv; 
    vIndex = index; 
    vRandom = aRandom;
}
