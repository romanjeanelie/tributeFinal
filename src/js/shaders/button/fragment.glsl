uniform float time;
uniform float wide;
uniform vec3 uColor;
uniform float changeColor;
uniform float opacity;

varying vec2 vUv;
varying vec3 vNormal;





float stroke (float x, float s, float w){
    return smoothstep(s, s + 0.4,x + w ) - smoothstep(s-0.4,s,x-w);
}
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


    float circle = length(vUv - 0.5); 
    // color += mix(vec3(1.,0.,0.), vec3(0.), 1.- vUv.x + sin(time * 5.) * 0.2) * vUv.y;
    float rect =rectSDF(vUv, vec2(1.));
    rect = fill(rect, 1.);


    // color += (0.05 / rect * vNormal.y - 0.1) *opacity;
    // color += ((1. - rect*1.5) * vNormal.y) * opacity;
    color += rect * vNormal.y;

    color = mix(uColor, vec3(0.02), 1. - color );
    color = mix(color, vec3(0.02), changeColor);

    float strobe = sin(time * 130.);
    float strobeLight = mix(0.93, 1., strobe);

    color *= strobeLight;
    gl_FragColor = vec4(color, opacity);

    
}