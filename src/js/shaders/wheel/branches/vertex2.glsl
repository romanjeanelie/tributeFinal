attribute float aRandom; 

varying float vRandom;
varying vec2 vUv; 

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = 4.0;
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv; 
    // vRandom = aRandom; 
}
