
uniform float time;
uniform float progress;
uniform sampler2D uTexture;

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

     // BARS
  float animShutter = time * .01;
  float factorDivision = 60.;
  float thickness = 0.3 + .01;


  float littleLines = stroke(fract((vUv.y + animShutter)*factorDivision), .7, thickness);

  float strobe = sin(time * 230.);
  float strobeLight = mix(0.8, 1., strobe);

  float lines = strobeLight * littleLines;

    vec4 textureImage = texture2D(uTexture, vec2(1. - vUv.x, 1.-vUv.y)) * lines * 2.;
   
 
  
  gl_FragColor = vec4(textureImage);
  //  gl_FragColor = vec4(vec3(vUv, 1.), sin(time));

}