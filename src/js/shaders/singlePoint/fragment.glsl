
uniform float time;
uniform vec3 color1;
uniform float opacity; 
uniform float isPressed; 


varying vec2 vUv;

float fill(float x, float size){
    return 1. - step(size, x);
}

void main()	{
    
    vec3 color = vec3(0.);

    float circle = length(vUv - 0.5); 
    circle = fill(circle, 0.02);
 
    vec3 finalColor = mix(color1, vec3(1.), sin(time * .2));
    float alpha = circle; 

    float growth =1. - sin(time * 3.) * 0.1;

     float distanceToCenter = distance(vUv, vec2(0.5)) * growth * isPressed;
    float strength = (0.25 / distanceToCenter - 0.5) * opacity;

    //float finalColor = mix(1., 0.1, strength * 3.);

    gl_FragColor = vec4(vec3(1.), strength * 3.);

}