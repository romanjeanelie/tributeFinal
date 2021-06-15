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
  vec3 color = vec3(0.);

  float strobe = sin(time * 230.);
  float strobeLight = mix(0.9, 1., strobe);

  float distanceToCenter = distance(vUv, vec2(0.9, 0.1) + sin(time * .5) * 1.5);
  float strength = (0.2 / distanceToCenter - 0.1) * opacity;

  color = mix(vec3(0.), vec3(1.), strength * 5.);



  gl_FragColor = vec4(color, 1.);

    
}