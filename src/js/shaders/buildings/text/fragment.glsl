uniform float time;
uniform float activeLines;
uniform float progress;
uniform float opacity;
uniform vec3 uColor1; 
uniform vec3 uColor2; 

varying vec2 vUv;
varying vec3 vNormal;



float stroke(float x, float s, float w){
  float d = smoothstep(s, s+0.3,x + w) - smoothstep(s-0.2,s, x-w);
  // float d = step(s, x + w) - step(s, x-w);
  return d; 
 }

void main()	{
  vec3 color = vec3(0.);

  float strobe = sin(time * 200.);
  float strobeLight = mix(0.8, 1., strobe);


  color = mix(vec3(0.), vec3(1.), 1.);

vec3 shapeText = vec3(vNormal.xy, 0.8);

vec3 result = mix(uColor1, vec3(0.),  shapeText);

color = mix(uColor1, uColor2, vNormal.z);

  // gl_FragColor = vec4(color, newNormal);
  // gl_FragColor = vec4(uColor1 * opacity, 1.);
  gl_FragColor = vec4(color, 1.);

    
}