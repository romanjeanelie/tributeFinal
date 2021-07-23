attribute float aOpacity;
attribute float size; 


varying vec2 vUv;
varying vec3 vPosition; 
varying float vOpacity;

uniform float uTime; 
uniform float uScale; 
uniform float disperse;
uniform float uPixelRatio;

void main(){
    vUv = uv;
    vPosition = position;

    vec3 newposition = position;

    // Disperse
    newposition.x *=  1. + (sin(position.z * 5.)  * 0.5) * disperse;
    newposition.y += (cos(position.x * 100.)  * 6.) * disperse;
    newposition.z *= 1. + sin(position.x * 8.)  * disperse;
   
    vec4 modelPosition = modelMatrix * vec4(newposition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 
    
    gl_Position = projectionPosition;

    gl_PointSize = max(size, uPixelRatio * 1000.);

    // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varying
    vOpacity = aOpacity; 
}