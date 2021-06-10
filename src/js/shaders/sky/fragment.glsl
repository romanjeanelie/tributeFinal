
uniform float time;
uniform float progress;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float opacity; 

varying vec2 vUv;


float stroke (float x, float s, float w){
    return smoothstep(s, s + 0.4,x + w ) - smoothstep(s-0.4,s,x-w);
}

void main()	{
  vec3 black = vec3(0.,0.,0.);
  vec3 red = vec3(1.,0.,0.);
  vec3 green = vec3(0.,1.,0.);
  vec3 blue = vec3(0.,0.,1.);
    
    vec3 color = vec3(0.);

    color += mix(mix(color1, color1, vUv.y), mix(color3, color4, vUv.y), vUv.y);

    
    gl_FragColor = vec4(color, 1.);
  //  gl_FragColor = vec4(vec3(vUv, 1.), 1.);

}