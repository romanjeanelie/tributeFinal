
uniform float time;
uniform float progress;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float changeColor; 
uniform float opacity; 

varying vec2 vUv;


float stroke (float x, float s, float w){
    return smoothstep(s, s + w/2.,x + w ) - smoothstep(s-w/2.,s,x-w);
}

void main()	{
  vec3 black = vec3(0.,0.,0.);
  vec3 red = vec3(1.,0.,0.);
  vec3 green = vec3(0.,1.,0.);
  vec3 blue = vec3(0.,0.,1.);
    
    vec3 color = vec3(0.);

    //color += mix(mix(color1, color1, vUv.y), mix(color3, color4, vUv.y), vUv.y);

    float step1 = smoothstep(1., 1. + 0.3,vUv.y + 0.2 ) - smoothstep(1.,1. - 0.2, vUv.y);

    float step2 = smoothstep(0.85, 0.85 + 0.6,vUv.y + 0.3 ) - smoothstep(0.85,0.85  - 0.8, vUv.y);

    vec3 stroke1 = mix(black, color1, step1);
    vec3 stroke2 = mix(black, color2, step2);
    color = stroke1;
    color += stroke2;

    vec3 finalColor = mix(vec3(0.), color, changeColor);
    
    gl_FragColor = vec4(finalColor, 1.);
  //  gl_FragColor = vec4(vec3(vUv, 1.), 1.);

}