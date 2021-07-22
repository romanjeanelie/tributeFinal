varying vec2 vUv;
varying float vIndex;  
varying float vRandom; 

uniform vec3 colorLittle;
uniform vec3 colorBig1;
uniform vec3 colorBig2;


float fill(float x, float size){
    return 1. - step(size, x);
}
void main(){
     vec3 color = vec3(0.);

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = (0.05 / distanceToCenter - 0.1) * 1.;


    color = mix(colorLittle, colorBig2, vIndex);
    
    gl_FragColor = vec4(color, strength*5. * vRandom);
}