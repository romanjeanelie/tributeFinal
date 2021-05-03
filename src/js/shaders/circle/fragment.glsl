
uniform float time;
uniform vec3 color1;

varying vec2 vUv;

float stroke (float x, float s, float w){
    return step(s, x + w * .5) - step(s, x-w * .5);
}


void main()	{
    
    vec3 color = vec3(0.);

    float circle = length(vUv - 0.5); 
    circle = stroke(circle, 0.4, .05);

    float alpha = circle; 
    color = mix(color1, vec3(0.,0.,0.), 1.-circle);



    gl_FragColor = vec4(color, alpha);

}