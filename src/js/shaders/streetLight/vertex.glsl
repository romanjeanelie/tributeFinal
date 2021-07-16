attribute float opacity; 
attribute float size; 

uniform float uPixelRatio;
uniform float time;
uniform float move; 

varying float vOpacity;
varying vec2 vUv;

void main(){
    vec3 newPosition = position; 
    newPosition.y += abs(time * sin(newPosition.x) * move);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;  

        gl_PointSize = max(size, uPixelRatio * 10000.);

        
        // Keep size attenuation
        gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv; 
    vOpacity = opacity;

}