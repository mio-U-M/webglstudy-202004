precision highp float;

uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    // vec2 ratio = vec2(
    //     min((uResolution.x / uResolution.y) / (1024. / 1024.), 1.0),
    //     min((uResolution.y / uResolution.x) / (1024. / 1024.), 1.0)
    //   );

    // vec2 uv = vec2(
    //     vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    //     vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    //   );
    gl_FragColor = texture2D(uTexture, uv);
}