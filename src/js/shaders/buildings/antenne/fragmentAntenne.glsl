uniform float time; 


void main()	{

    gl_FragColor = vec4(vec3(1.,0.,0.), 0.7 + sin(time * 2.));

}