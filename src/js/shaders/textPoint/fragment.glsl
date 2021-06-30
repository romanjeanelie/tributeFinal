uniform float time;
uniform float progress;
uniform float opacity;
uniform vec3 color1;

varying vec2 vUv;


void main()	{

     float strobe = sin(time * 2000.);
    float strobeLight = mix(0.9, 1., strobe); 
    gl_FragColor = vec4(color1, opacity);
    
}