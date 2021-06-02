varying vec2 vUv;

float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

float fill(float x, float size){
    return  1. - smoothstep(size - 0.1,size + 0.9, x);
}

void main(){
    vec3 color = vec3(0.,0.,0.);
    float window = rectSDF(vUv, vec2(0.5));
    window = fill(window, 1.);


    float finalWindow = window ; 
    color += vec3(finalWindow );
    color = mix(vec3(0.,0.,0.1), vec3(1.,0.,0.), color);


 gl_FragColor = vec4(vec3(color),finalWindow);   
 //gl_FragColor = vec4(vec3(1.,0.,0.),1.);   
}