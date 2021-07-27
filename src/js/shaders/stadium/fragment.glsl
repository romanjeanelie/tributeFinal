uniform vec3 color1;
uniform vec3 color2;
uniform float uOpacity;

varying float vOpacity; 
varying vec2 vUv;


void main()	{

    vec3 color = vec3(0.);
   
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * 1.;

    vec3 finalColor = mix(color1, color2, vOpacity);
 
   gl_FragColor = vec4(finalColor, strength*5. * vOpacity);
    //  gl_FragColor = vec4(vec3(1.), 1.);


}