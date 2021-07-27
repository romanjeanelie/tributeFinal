uniform float time;
uniform float wide;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float changeColor;
uniform float opacity;

varying vec2 vUv;
varying vec3 vNormal;



float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x),
                abs(st.y/s.y) );
}

float fill(float x, float size) {
    return 1. - smoothstep(size - 0.05,size, x);
}

void main()	{
    vec3 color = vec3(0.);

    float rect =rectSDF(vUv, vec2(1.));
    rect = fill(rect, 1.);


    color += rect * vNormal.y;

    vec3 color1 = mix(uColor1, vec3(0.02), 1. - color );
    vec3 color2 = mix(uColor2, vec3(0.02), 1. - color );

    color = mix(color1, color2, changeColor);


    // color *= strobeLight;
    gl_FragColor = vec4(color, opacity);

    
}