attribute float aOpacity;
attribute float size; 


varying vec2 vUv;
varying vec3 vPosition; 
varying float vOpacity;

uniform float uTime; 
uniform float uScale; 
uniform float uPixelRatio;
uniform float disperse;
uniform float offset;
uniform float scaleSize;

void main(){
    vUv = uv;
    vPosition = position;

    vec3 newposition = position;

    // newposition.x *=  1. + (sin(position.y * 1000.)  * 8.) * disperse;
    // newposition.y *= 1. +  (cos(position.y * 100.)  * 6.) * disperse;
    // newposition.z *= 1. + sin(position.y * .5)  * disperse;

    // Disperse
    newposition.x *=  1. + (sin(position.y * 10.)  * 8.) * disperse;
    newposition.y *= 1. +  (cos(position.y * 100.)  * 6.) * disperse;
    newposition.z *= 1. + sin(position.y * .05)  * disperse;

    // Offset
    newposition.y += 420. * disperse;
    newposition.z -= 410. * disperse;

   
    vec4 modelPosition = modelMatrix * vec4(newposition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 
    
    gl_Position = projectionPosition;

    gl_PointSize = max(size * (1. + 2. * (1. - disperse)) * scaleSize, uPixelRatio * 1000.);
    // gl_PointSize = 2.* uPixelRatio;
        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varying
    vOpacity = aOpacity; 
}