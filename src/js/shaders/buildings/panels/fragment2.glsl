uniform vec3 color1;

varying float vOpacity; 
varying vec2 vUv;

float rectSDF (vec2 st, vec2 s){
    st = st*2.-1.;
    return max(abs(st.x/s.x), abs(st.y/s.y));
}

float fill (float x, float s){
    return 1. - smoothstep(s,s + 0.09, x);
}

void main()	{
    vec3 color = vec3(0.);

    float rect = rectSDF(vUv, vec2(0.9));
    rect = fill(rect, 0.93);

    // float distanceHor = distance(vUv.x, 0.5);
    // float distanceVert = distance(vUv.y, 0.5);
    //   float strengthHor = 0.45 / (distanceHor) - 0.6;
    //   float strengthVert = 3.9 / (distanceVert) -8.2;
    //  float strength =  min(strengthHor, strengthVert);

    color += rect; 
    gl_FragColor = vec4(vec3(1.), .9);

}