uniform float time;
uniform float activeLines;
uniform float progress;
uniform float opacity;
uniform vec3 uColor; 

varying vec2 vUv;


float stroke(float x, float s, float w){
  float d = smoothstep(s, s+0.3,x + w) - smoothstep(s-0.2,s, x-w);
  // float d = step(s, x + w) - step(s, x-w);
  return d; 
 }

void main()	{

   // BARS
  float speed =  time * 2.;
  // float animShutter = (200. * activeLines) * speed ;
  // float factorDivision = .04;
  // float thickness = 0.5 ;
  float animShutter = time * 0.;
  float factorDivision = 50.5;
  float thickness = 0.3 ;


  float littleLines = stroke(fract((vUv.y + animShutter)*factorDivision), .7, thickness);

  float strobe = sin(time * 230.);
  float strobeLight = mix(0.9, 1., strobe);

  float color =  strobeLight  * opacity;

    gl_FragColor = vec4(vec3(uColor), color);

    
}