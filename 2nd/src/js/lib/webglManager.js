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

const COLOR_LIST = [0x57d1c9, 0xed5485, 0xfffbcb, 0xffe869, 0xa9a9f0];

const MATERIAL_PARAM = {
    size: 1.0, // 頂点の基本となるサイズ @@@
    sizeAttenuation: true, // 遠近感を出すかどうかの真偽値
    opacity: 0.8, // 不透明度 @@@
    transparent: true, // 透明度を有効化するかどうか @@@
    // blending: THREE.AdditiveBlending, // 加算合成モードで色を混ぜる @@@
    depthWrite: false // 深度値を書き込むかどうか @@@
};

const TEXTURES = {
    triangleFill1: "triangle-fill-1.png",
    triangleFill2: "triangle-fill-2.png",
    triangleFill3: "triangle-fill-3.png",
    triangleLine1: "triangle-line-1.png",
    triangleLine2: "triangle-line-2.png"
};

export default class WebglManager extends EventEmitter {
    constructor(canvas) {
        super();

        this.canvas = canvas;

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.light = null;

        this.materialPointList = [];
        this.pointList = [];
        this.mapedTextures = [];

        this.isCameraRotate = false;
    }

    async init() {
        await this.loadTexture();
        this.setupWebgl();
        this.resize();

        gsap.ticker.add(time => {
            if (this.isCameraRotate) {
                this.camera.rotation.y += 0.03;
            }

            this.camera.rotation.y += 0.001;

            this.renderer.render(this.scene, this.camera);
        });

        window.addEventListener("resize", () => {
            this.resize();
        });

        // key
        window.addEventListener("keydown", eve => {
            if (eve.key === " ") {
                this.isCameraRotate = true;
            }
        });
        window.addEventListener("keyup", () => {
            if (this.isCameraRotate) {
                this.isCameraRotate = false;
            }
        });
        // touchevent
        window.addEventListener("touchstart", () => {
            this.isCameraRotate = true;
        });
        window.addEventListener("touchend", () => {
            this.isCameraRotate = false;
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
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // const axes = new THREE.AxesHelper(25);
        // this.scene.add(axes);

        const COUNT = 200;
        const SIZE = 30.0;

        Object.keys(TEXTURES).forEach((key, index) => {
            const material = new THREE.PointsMaterial(MATERIAL_PARAM);
            material.color = new THREE.Color(
                COLOR_LIST[index % COLOR_LIST.length]
            );
            const texture = this.textures[key];
            material.map = texture;
            this.materialPointList.push(material);

            const geomerty = new THREE.Geometry();
            for (let i = 0; i <= COUNT; ++i) {
                // Math.random は 0 以上 1 未満の数値をランダムで返す
                const x = (Math.random() - 0.5) * 2.0 * SIZE;
                const y = (Math.random() - 0.5) * 2.0 * SIZE;
                const z = (Math.random() - 0.5) * 2.0 * SIZE;
                const point = new THREE.Vector3(x, y, z);
                geomerty.vertices.push(point);
            }

            const pointMesh = new THREE.Points(geomerty, material);
            this.scene.add(pointMesh);
            this.pointList.push(pointMesh);
        });

        // this.controls = new OrbitControls(
        //     this.camera,
        //     this.renderer.domElement
        // );
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

    createRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
}
