uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
uniform vec3 colorOrb;

uniform float isColor1;
uniform float isColor2;
uniform float isColor3;
uniform float isColor4;
uniform float isColor5;

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

    float growth = 1. - sin(time * 3.) * 0.1;

    float distanceToCenter = distance(vUv, vec2(0.5)) * growth * isPressed;
     
    float strobe = sin(time * 2000.);
    float strobeLight = mix(0.9, 1., strobe);

    float strength = (0.25 / distanceToCenter - 0.5) * strobeLight * opacity;

  

    vec3 result = color1 * isColor1 + color2 * isColor2 + color3 * isColor3 + color4 * isColor4 + color5 * isColor5;
    result = mix(colorOrb, vec3(1.),  strength + 0.5);
   

    //float finalColor = mix(1., 0.1, strength * 3.);

    gl_FragColor = vec4(result, strength * 3.);

}