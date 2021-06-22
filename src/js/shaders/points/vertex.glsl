uniform float time;
uniform float uPixelRatio;
uniform float squeeze;

attribute float size; 

varying vec2 vUv;

void main() {
    vec3 newposition = position;

    newposition.y += sin(time  + newposition.z * 100.) * 15.;

    newposition.z -= squeeze;
    

    vec4 modelPosition = modelMatrix * vec4(newposition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;

    gl_PointSize = size * uPixelRatio * (1. + squeeze * 0.2);
        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv; 
}