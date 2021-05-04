
uniform float time;
uniform vec3 color1;
uniform float opacity; 


varying vec2 vUv;

float stroke (float x, float s, float w){
    return step(s, x + w * .5) - step(s, x-w * .5);
}


void main()	{
    
    vec3 color = vec3(0.);

    float circle = length(vUv - 0.5); 
    circle = 1.-step(0.01, circle);
 
    color = mix(vec3(0.,0.,0.), color1, circle);
    float alpha = circle; 



    gl_FragColor = vec4(color, alpha);

}