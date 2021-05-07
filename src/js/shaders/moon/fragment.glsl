uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;


void main()	{

    vec3 color = mix(color2, color1, vUv.y-0.5);

  
    gl_FragColor = vec4(color, 1.);

    
}