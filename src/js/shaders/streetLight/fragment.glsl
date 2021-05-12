varying vec2 vUv;
uniform vec3 color;

void main(){
    float circle =  distance(vUv, vec2(0.5));
    circle = 0.15 / circle - 0.4; 


 gl_FragColor = vec4(vec3(color),circle);   
}