import gsap from "gsap";
import vert from "../../shader/vertics.vert";
import gradientFrag from "../../shader/gradient.frag";
import { IMG_DIR } from "../../constants.yml";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { easing } from "../lib/easing";

const DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
    x: 1.0,
    y: 5.0,
    z: 10.0
};

const COLOR_PALLETE = {
    vividpurple: "#A599FD",
    pinkred: "#EE54DA",
    skyblue: "#197CE4"
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

export default class WebglManager {
    constructor(canvas) {
        this.canvas = canvas;

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.light = null;

        this.meshList = [];
    }

    init() {
        this.setupWebgl();
        this.resize();

        gsap.ticker.add(time => {
            this.renderer.render(this.scene, this.camera);
            //     if (this.meshList) {
            //         this.meshList.forEach(mesh => {
            //             mesh.position.x += Math.cos(time) * Math.random() * 0.001;
            //             mesh.position.y +=
            //                 easing.easeInOutCubic(Math.sin(time * 0.1)) *
            //                 Math.random() *
            //                 0.001;
            //         });
            //     }
        });

        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    setupWebgl() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        });
        this.renderer.setClearColor(new THREE.Color(0x555555));

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight
        );
        this.camera.position.set(0, 0, +10);

        const MATERIAL_PARAM = {
            color: 0x00007f
        };
        this.geometry = new THREE.BoxGeometry(
            BOX_SIZE.w,
            BOX_SIZE.h,
            BOX_SIZE.d
        );
        this.material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);

        for (let ypos = 1; ypos < BOX_COUNT.y; ypos++) {
            for (let xpos = 1; xpos < BOX_COUNT.x; xpos++) {
                const mesh = new THREE.Mesh(this.geometry, this.material);
                mesh.position.set(
                    0.5 * BOX_SIZE.w * (xpos - BOX_COUNT.x * 0.5),
                    0.5 * BOX_SIZE.h * (ypos - BOX_COUNT.y * 0.5),
                    0
                );
                this.scene.add(mesh);
                this.meshList.push(mesh);
            }
        }

        this.light = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        this.light.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        this.light.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        this.light.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        this.scene.add(this.light);

        const axes = new THREE.AxesHelper(25);
        this.scene.add(axes);

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
