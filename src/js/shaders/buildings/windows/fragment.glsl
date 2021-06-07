uniform vec3 color1;

varying float vOpacity; 
varying vec2 vUv;


void main()	{

    gl_FragColor = vec4(vec3(1.,1.,1.), vOpacity);

}