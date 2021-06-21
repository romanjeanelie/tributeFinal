uniform float time;
uniform float progress;
uniform float opacity;
uniform vec3 color1;

varying vec2 vUv;


void main()	{
    gl_FragColor = vec4(color1, opacity * 0.6);
    
}