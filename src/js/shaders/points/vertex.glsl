uniform float time;
uniform float uPixelRatio;

attribute float size; 

varying vec2 vUv;

void main() {
    vec3 newposition = position;

    newposition.y += sin(time  + newposition.z * 100.) * 15.;

    vec4 modelPosition = modelMatrix * vec4(newposition, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;

    gl_PointSize = size * uPixelRatio;
        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv; 
}