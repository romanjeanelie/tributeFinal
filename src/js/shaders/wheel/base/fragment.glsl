uniform vec3 uColor1;
uniform vec3 uColor2;


uniform float opacity; 


varying vec2 vUv;

float fill(float x, float size){
    return 1. - step(size, x);
}

float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

void main()	{
    
    vec3 color = vec3(0.);

    float rect = rectSDF(vUv, vec2(0.7, 0.9));
    rect =smoothstep(0.4, 1., rect);

    // color += 1. - rect;

    color = mix(uColor1, uColor2, 0.1 + (1.  - rect));
    // color = mix(vec3(0.), color, 0.65  +rect);

    float strength = (0.6 / rect - 0.3) ;

    gl_FragColor = vec4(color, strength);
    // gl_FragColor = vec4(vec3(strength), strength);

}