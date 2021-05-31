varying vec2 vUv;
uniform vec3 color;


float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

void main(){
    float window =  rectSDF(vUv, 0.5);
    //circle = 0.2 / circle - 0.4; 


 gl_FragColor = vec4(vec3(1.),window);   
}