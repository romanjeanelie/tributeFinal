attribute vec3 aRandom;

varying vec2 vUv;
varying vec3 vPosition; 

uniform float uTime; 
uniform float uScale; 

void main(){
    vUv = uv;
    vPosition = position;

    float time = uTime * .02;

    vec3 pos = position;
    pos.x += sin(time * aRandom.x ) * 0.01;
    pos.y += cos(time * aRandom.y ) * 0.01;
    pos.z += cos(time * aRandom.z ) * 0.01;

    pos.x *= uScale + (sin(pos.y * 4. + time) * (1. - uScale)); 
    pos.y *= uScale + (cos(pos.z * 4. + time) * (1. - uScale)); 
    pos.z *= uScale + (sin(pos.x * 4. + time) * (1. - uScale)); 

    // pos.z *= aRandom.x * uScale;
    

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 800.0 / -mvPosition.z;
}