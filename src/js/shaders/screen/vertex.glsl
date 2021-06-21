uniform float time;

varying vec2 vUv;

void main() {
    vec3 newposition = position;

    // newposition.x += (newposition.y*sin(time * .05)*10.);
    // newposition.y += (newposition.x*sin(time * .5));


    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );

    vUv = uv; 
}