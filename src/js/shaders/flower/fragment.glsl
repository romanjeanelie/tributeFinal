varying vec2 vUv;
varying vec3 vPosition; 
varying float vOpacity;


uniform vec3 color1;
uniform vec3 color2;
uniform float uOpacity;
uniform float disperse;

float fill(float x, float size){
    return 1. - step(size, x);
}

void main(){

    float circle = length(gl_PointCoord - 0.5)*2.; 
    circle = fill(circle, 0.5);

    float alpha = circle;

   
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * uOpacity;
 
    vec3 finalColor = mix(color1, color2, vOpacity);
    finalColor = mix(finalColor, vec3(0.8), disperse);

    gl_FragColor = vec4(finalColor,strength * 5.);
}