uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float wide;

uniform float changeColor;

varying vec2 vUv;
varying vec3 vNormal;



float stroke (float x, float s, float w){
    return smoothstep(s, s + 0.4,x + w ) - smoothstep(s-0.4,s,x-w);
}


void main()	{
    vec3 color = vec3(0.);


    color += mix(color1 * changeColor, color2 * changeColor, 1. - vUv.x * wide);

  
    gl_FragColor = vec4(color, 1.);

    
}