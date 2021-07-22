
uniform float time;
uniform float progress;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float changeColor; 
uniform float thickFactor; 
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
    return 1. - smoothstep(size, size + .5, x);
}

void main()	{
  vec3 black = vec3(0.,0.,0.);

    
  vec3 color = vec3(0.);

     // BARS
  float animShutter = time * .01;
  float factorDivision = 100. - 4.;
  float thickness = 0.3 + .01;


  float littleLines = stroke(fract((vUv.y + animShutter)*factorDivision), .7, thickness);

  float strobe = sin(time * 130.);
  float strobeLight = mix(0.93, 1., strobe);

  float lines = strobeLight * littleLines;

   
  float rect = rectSDF(vUv, vec2(0.7, 0.7));
  rect = fill(rect, 1.);

  float threshold0 =  0.53;
  float size0 = 0.99;

  float threshold1 =  0.95;
  float size1 = 0.3;

  float threshold2 = 0.99;
  float size2 = 0.1;

  // float step0 = stroke(vUv.y, threshold0, size0);
  // float step1 = stroke(vUv.y, threshold1, size1);
  float step0 = smoothstep(threshold0, threshold0 + size0/1., vUv.y +  size0 ) - smoothstep(threshold0 - size0/1.,threshold0, vUv.y - size0);
  float step1 = smoothstep(threshold1, threshold1 + size1/1., vUv.y +  size1 ) - smoothstep(threshold1 - size1/1.,threshold1, vUv.y - size1);
  float step2 = smoothstep(threshold2, threshold2 + size2/1., vUv.y +  size2 ) - smoothstep(threshold2 - size2/1.,threshold2, vUv.y - size2);


  vec3 stroke1 = mix(black, color1, step1);
  vec3 stroke2 = mix(black, color2, step2);
  vec3 stroke3 =  mix(black, color3, step0);


  color = stroke1;
  color += stroke2;
  color += stroke3;

  color *= rect;

  // ADD LINES
//   vec3 finalColor = mix(vec3(0.), color,changeColor) / 1. + lines * opacity *0.02;
  vec3 finalColor = mix(vec3(0.), color,changeColor);
  
  gl_FragColor = vec4(color,  opacity);
  // gl_FragColor = vec4(vec3(rect),  opacity);

}