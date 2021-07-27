
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color1a;
uniform vec3 color2a;
uniform vec3 color3a;
uniform float opacity; 
uniform float animColors; 
uniform float changeColor; 

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

  
  float rect = rectSDF(vUv, vec2(0.7, 0.7));
  rect = fill(rect, 1.);

  float threshold0 =  0.66 ;
  float size0 = 0.25;

  float threshold1up = 0.93 - 0.1 * changeColor;
  float threshold1down = 0.99;
  float size1 = 0.3 * changeColor;

  float threshold2 = 0.95;
  float size2 = 0.04;

  // float step0 = stroke(vUv.y, threshold0, size0);
  // float step1 = stroke(vUv.y, threshold1, size1);
  float step0 = smoothstep(threshold0, threshold0 + size0/1., vUv.y  +  size0 ) - smoothstep(threshold0 - size0/1.,threshold0, vUv.y - size0  * animColors);
  float step1 = smoothstep(threshold1up * animColors , threshold1down + size1/1. , vUv.y  +  size1 * animColors ) - smoothstep(threshold1down - size1/1.,threshold1down, vUv.y - size1 );
  float step2 = smoothstep(threshold2 , threshold2 + size2/1.  * animColors, vUv.y +  size2 ) - smoothstep(threshold2 - size2/1.,threshold2, vUv.y - size2 * animColors );

 
  vec3 stroke1 = mix(black, color1, step1 );
  vec3 stroke2 = mix(black, color2, step2  - (1.- animColors));
  vec3 stroke3 =  mix(black , color3, step0 );

  vec3 stroke1a = mix(black, color1a, step1 );
  vec3 stroke2a = mix(black, color2a, step2  - (1.- animColors));
  vec3 stroke3a =  mix(black , color3a, step0 );

  vec3 colorFinal1 = mix(stroke1, stroke1a, changeColor);
  vec3 colorFinal2 = mix(stroke2, stroke2a, changeColor);
  vec3 colorFinal3 = mix(stroke3, stroke3a, changeColor);



  color = colorFinal1;
  color += colorFinal2;
  color += colorFinal3;

  color *= rect;


  
  gl_FragColor = vec4(color,  opacity);
  // gl_FragColor = vec4(vec3(rect),  opacity);

}