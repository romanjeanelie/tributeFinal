varying vec2 vUv;
varying vec3 vPosition; 

uniform vec3 uColor1;
uniform vec3 uColor2;


void main(){
    vec3 color = vec3(1.0,0.0,0.0);
    color = vec3(1.0,0.0,0.0) * vPosition.z +0.07;

    vec3 color1 = vec3(10./255.,30./255.,100./255.);
    vec3 color2 = vec3(1.,1.,0.);

    float depth = vPosition.z * 0.5 + 0.5;
    color = mix(uColor1,uColor2, depth);
    // gl_FragColor = vec4(color,depth * 0.3 + 0.2);
    gl_FragColor = vec4(vec3(1.),1.);
}