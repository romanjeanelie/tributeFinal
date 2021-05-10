
uniform float time;
uniform vec3 color1;
uniform float opacity; 

varying vec2 vUv;

float stroke (float x, float s, float w){
    return smoothstep(s-0.05,s, x + w * .5) - smoothstep(s,s+0.2, x-w * .5);
}


void main()	{
    
    vec3 color = vec3(0.);

    float circle = length(vUv - 0.5); 
    circle = stroke(circle, 0.3, .005);


    color = mix(color1, vec3(0.,0.,0.), 1.-circle);
    float alpha = circle * opacity; 



    gl_FragColor = vec4(color, alpha);

}