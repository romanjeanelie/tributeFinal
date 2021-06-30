uniform float time;
uniform float thickFactor;
uniform float wide;
uniform float progress;
uniform float opacity;
uniform vec3 uColor; 

varying vec2 vUv;

float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

float stroke(float x, float s, float w){
  float d = smoothstep(s, s+0.3,x + w) - smoothstep(s-0.2,s, x-w);
  // float d = step(s, x + w) - step(s, x-w);
  return d; 
 }

 float fill(float x, float size){
    return 1. - step(size, x);
}


void main()	{

  vec3 color = vec3(0.);

  float rect = rectSDF(vUv, vec2(1., 0.4 + wide));
    rect = 1. - fill(rect, 1.);

  float animShutter = time * .005;
  float factorDivision = 200.5 * thickFactor;
  float thickness = 0.3 ;


  float littleLines = stroke(fract((vUv.y + animShutter)*factorDivision), .7, thickness);

  float strobe = sin(time * 130.);
  float strobeLight = mix(0.93, 1., strobe);

 float lines = strobeLight * littleLines * 0.08;

    gl_FragColor = vec4(vec3(1. - rect), ( lines + rect) * opacity);

    
}