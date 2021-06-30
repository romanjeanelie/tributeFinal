uniform float time;
uniform float opacity; 
uniform float wide; 
uniform vec3 color1; 
uniform float isPressed; 

varying vec2 vUv;



float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

float fill(float x, float size){
    return 1. - step(size, x);
}

float stroke(float x, float s, float w){
  float d = smoothstep(s, s+0.3,x + w) - smoothstep(s-0.2,s, x-w);
  // float d = step(s, x + w) - step(s, x-w);
  return d; 
 }


void main()	{
    
    vec3 color = vec3(0.);

    float rect = rectSDF(vUv, vec2(1., 0.25 + wide));
    rect = fill(rect, 1.);

    float growth = 1. - sin(time * 3.) * 0.1;
    float distanceToCenter = 1. - distance(vUv, vec2(0.5)) * growth * isPressed;

   float strobe = sin(time * 2000.);
    float strobeLight = mix(0.98, 1., strobe);


    float result = (distanceToCenter - 0.55) * strobeLight * 0.8;


    color = mix(vec3(0.), color1, result *  opacity);




  

    gl_FragColor = vec4(color, result);

}