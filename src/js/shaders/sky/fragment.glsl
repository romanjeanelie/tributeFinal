
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
    return smoothstep(s, s + w/1.,x + w ) - smoothstep(s-w/1.,s,x-w);
}

float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

float fill(float x, float size){
    return 1. - smoothstep(size, size + 4., x);
}

void main()	{
  vec3 black = vec3(0.,0.,0.);

    
    vec3 color = vec3(0.);

   
    float rect = rectSDF(vUv, vec2(0.21, 1.));
    rect = fill(rect, 1.);

    float step1 = stroke(vUv.y, 0.73, 0.28);
    // float step2 = stroke(vUv.y, 0.865, 0.17);
    float step2 = smoothstep(0.865, 0.865 + 0.17/1., vUv.y +  0.17 ) - smoothstep(0.865 - 0.04,0.865, vUv.y - 0.15);


    vec3 stroke1 = mix(black, color1, step1);
    vec3 stroke2 = mix(black, color2, step2);


    color = stroke1;
    color += stroke2;

    color *= rect;

    vec3 finalColor = mix(vec3(0.), color,changeColor);
    
    gl_FragColor = vec4(finalColor, 1.);
  //  gl_FragColor = vec4(vec3(vUv, 1.), 1.);

}