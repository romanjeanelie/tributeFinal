uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float opacity;
uniform float wide;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;



float stroke (float x, float s, float w){
    return smoothstep(s, s + 0.4,x + w ) - smoothstep(s-0.4,s,x-w);
}


void main()	{
    vec3 color = vec3(0.);


    float circle = length(vUv - 0.5); 
    // color += mix(vec3(1.,0.,0.), vec3(0.), 1.- vUv.x + sin(time * 5.) * 0.2) * vUv.y;
    color += 0.05 / circle * vNormal.y - 0.1;
    color += (1. - circle*1.5) * vNormal.y;

    color = mix(vec3(1.,0.,0.), vec3(0.), 1. - color);

   float strobe = sin(time * 130.);
  float strobeLight = mix(0.93, 1., strobe);

  color *= strobeLight;
    gl_FragColor = vec4(color, 1.);
    // gl_FragColor = vec4(vNormal, 1.);

    
}