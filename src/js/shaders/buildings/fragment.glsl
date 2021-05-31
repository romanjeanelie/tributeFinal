varying vec2 vUv;

float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

void main(){
    float window = rectSDF(vUv, vec2(0.5));
    window = 0.8 / window - 0.4; 


 gl_FragColor = vec4(vec3(window),window);   
}