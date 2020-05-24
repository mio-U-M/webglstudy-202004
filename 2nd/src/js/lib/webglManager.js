import gsap from "gsap";
import * as THREE from "three";
import EventEmitter from "events";
import { threeTextureLoad } from "./threeTextureLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
    color: 0xe0007f
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

    init() {
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
        this.renderer.setClearColor(new THREE.Color(0x222222));

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight
        );
        this.camera.position.set(0, 0, +10);

        const axes = new THREE.AxesHelper(25);
        this.scene.add(axes);

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
}
