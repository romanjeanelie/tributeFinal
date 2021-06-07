uniform float uPixelRatio;

attribute float size; 
attribute float opacity; 

varying vec2 vUv;
varying vec3 vScale;
varying float vOpacity;

void main() {
    vec3 newposition = position;

    vec4 modelPosition = modelMatrix * vec4(position, 1.); 
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectionPosition = projectionMatrix * viewPosition; 

    gl_Position = projectionPosition;

    gl_PointSize = size * uPixelRatio;
        // Keep size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = uv; 
    vOpacity = opacity;
}