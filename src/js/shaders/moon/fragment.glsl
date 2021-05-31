uniform vec3 color1;
uniform vec3 color2;

varying vec2 vUv;
varying vec3 vNormal;

float stroke (float x, float s, float w){
    return smoothstep(s, s + 0.4,x + w ) - smoothstep(s-0.4,s,x-w);
}


void main()	{

    float overlay = stroke(vUv.y, 0.5, 0.45) - 0.5;

    // vec3 color = mix(color2, color1, vUv.y-0.5);
    vec3 color = mix(color2, color1, vUv.y-0.5);

  
    gl_FragColor = vec4(color, 1.);

    
}