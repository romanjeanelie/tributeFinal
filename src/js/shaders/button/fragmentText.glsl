uniform float time;
uniform float wide;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float changeColor;
uniform float opacity;

varying vec2 vUv;
varying vec3 vNormal;


void main()	{
    vec3 color = vec3(0.);

    color = mix(uColor1, uColor2, changeColor);

    gl_FragColor = vec4(color, opacity);

    
}