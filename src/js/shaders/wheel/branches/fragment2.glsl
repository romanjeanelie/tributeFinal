varying vec2 vUv; 

uniform vec3 uColor1;
uniform vec3 uColor2;

float fill(float x, float size){
    return 1. - step(size, x);
}


void main()	{
    
    vec3 color = vec3(0.);

    float circle = length(vUv - 0.5)*2.; 
    circle =  1. - smoothstep(0.2, 1.3, circle);


    color += mix(uColor2, uColor1, vUv.x);

    gl_FragColor = vec4(color, 0.5);
    // gl_FragColor = vec4(vec2(vUv), 1., 1. );
}