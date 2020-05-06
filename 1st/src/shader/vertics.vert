precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute mat4 projectionMatrix;
attribute mat4 modelViewMatrix;

uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

void main() {
  // vUv = uv;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  gl_Position = vec4(position, 1.0);
}