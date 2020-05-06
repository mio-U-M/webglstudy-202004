precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uNoiseOffset1;
uniform float uNoiseOffset2;
uniform float uNoiseOffset3;

#define SRGB_TO_LINEAR(c) pow((c), vec3(2.2))
#define LINEAR_TO_SRGB(c) pow((c), vec3(1.0 / 2.2))
#define SRGB(r, g, b) SRGB_TO_LINEAR(vec3(float(r), float(g), float(b)) / 255.0)

#define X_SCALE 0.7
#define Y_SCALE 0.7

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// webgl-noise --------------------------------
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
// --------------------------------

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    float noise1 = snoise(vec2(sin(uv.x * X_SCALE), cos(uv.y * Y_SCALE)) + vec2(.9 + uTime * 0.021, .5 + uTime * 0.023));
    noise1 = clamp(noise1, 0., 1.);

    vec3 color1 = mix(
      vec3(0.1), // 0~
      SRGB(uColor1.x, uColor1.y, uColor1.z), // ~1
      noise1 * uNoiseOffset1 // 0 - 1
    ); 

    float noise2 = snoise(vec2(cos(uv.x * X_SCALE), sin(uv.y * Y_SCALE)) + vec2(.1 + uTime * 0.02, .2 + uTime * 0.021)); 
    noise2 = clamp(noise2, 0., 1.);

    vec3 color2 = mix(
      vec3(0.1), // 0~
      SRGB(uColor2.x, uColor2.y, uColor2.z), // ~1
      noise2 * uNoiseOffset2 // 0 - 1
    );

    float noise3 = snoise(vec2( -1. * uv.x * X_SCALE, -1. * uv.y * Y_SCALE) + vec2(.3 + uTime * 0.022, uTime * 0.018)); 
    noise3 = clamp(noise3, 0., 1.);

    vec3 color3 = mix(
      vec3(0.1), // 0~
      SRGB(uColor3.x, uColor3.y, uColor3.z), // ~1
      noise3 * uNoiseOffset3 // 0 - 1
    );

    vec3 totalColor = clamp(color1 + color2 + color3, 0., 1.);
    float totalNoise = clamp(noise1 + noise2 + noise3, 0., 1.);

    vec3 color = mix(
  	  vec3(1.), // background
      totalColor, // calc color
      totalNoise
    );
    gl_FragColor = vec4(color, 1.0);
}