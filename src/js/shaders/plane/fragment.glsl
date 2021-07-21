varying vec2 vUv;

uniform vec3 color1;
uniform vec3 color2;
uniform float time; 


float fill(float x, float size){
    return 1. - step(size, x);
}
void main(){
     vec3 color = vec3(0.);

    float circle = length(vUv - 0.5)*2.; 
    circle = fill(circle, 0.5);

    color = mix(vec3(0.,0.,0.), color1, circle);
    float alpha = circle;
   
    float distanceToCenter = distance(vUv, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * 1.;


    gl_FragColor = vec4(color1, strength*5.);
}