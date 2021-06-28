uniform float time;
uniform float squeeze;

varying vec2 vUv;

void main() {
    vec3 newposition = position;

//   newposition.x += (newposition.y*sin(time * .05)*10.);
    // newposition.y *= 1. + sin(squeeze * 1.) * 10.;


    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );

    vUv = uv; 
}