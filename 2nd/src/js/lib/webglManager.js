import gsap from "gsap";
import * as THREE from "three";
import EventEmitter from "events";
import { threeTextureLoad } from "./threeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { easing } from "../lib/easing";

const DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
    x: 1.0,
    y: 5.0,
    z: 10.0
};

const BOX_SIZE = {
    w: 1.0,
    h: 1.0,
    d: 1.0
};

const BOX_COUNT = {
    x: 10,
    y: 10
};

const MATERIAL_PARAM = {
    color: 0xff9933, // 頂点の色
    size: 0.5, // 頂点の基本となるサイズ @@@
    sizeAttenuation: true, // 遠近感を出すかどうかの真偽値
    opacity: 0.8, // 不透明度 @@@
    transparent: true, // 透明度を有効化するかどうか @@@
    // blending: THREE.AdditiveBlending, // 加算合成モードで色を混ぜる @@@
    depthWrite: false // 深度値を書き込むかどうか @@@
};

const TEXTURES = {
    triangleFill: "triangle-fill.png",
    triangleLine: "triangle-line.png"
};

export default class WebglManager extends EventEmitter {
    constructor(canvas) {
        super();

        this.canvas = canvas;

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.light = null;

        this.meshList = [];
    }

    async init() {
        await this.loadTexture();
        this.setupWebgl();
        this.resize();

        gsap.ticker.add(time => {
            this.renderer.render(this.scene, this.camera);
        });

        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    async loadTexture() {
        this.textures = await threeTextureLoad(TEXTURES);
    }

    setupWebgl() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        });
        this.renderer.setClearColor(new THREE.Color(0xdddddd));

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight
        );
        this.camera.position.set(0, 0, +10);

        const axes = new THREE.AxesHelper(25);
        this.scene.add(axes);

        // point sprite
        this.materialPoint = new THREE.PointsMaterial(MATERIAL_PARAM);
        this.materialPoint.map = this.textures.triangleLine;
        // geometry
        this.geomerty = new THREE.Geometry(); // プレーンなジオメトリ
        const COUNT = 1000;
        const SIZE = 30.0;
        for (let i = 0; i <= COUNT; ++i) {
            // Math.random は 0 以上 1 未満の数値をランダムで返す
            const x = (Math.random() - 0.5) * 2.0 * SIZE;
            const y = (Math.random() - 0.5) * 2.0 * SIZE;
            const z = (Math.random() - 0.5) * 2.0 * SIZE;
            const point = new THREE.Vector3(x, y, z);
            this.geomerty.vertices.push(point);
        }

        this.point = new THREE.Points(this.geomerty, this.materialPoint);
        this.scene.add(this.point);

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
    }

    resize() {
        this.canvas.style.width = window.innerWidth;
        this.canvas.style.height = window.innerHeight;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    hexToRgb(color) {
        // #が先頭についてたら除去
        const replacedColor = color.replace(/#/g, "");

        return [
            parseInt(replacedColor.substr(0, 2), 16),
            parseInt(replacedColor.substr(2, 2), 16),
            parseInt(replacedColor.substr(4, 2), 16)
        ];
    }
}
