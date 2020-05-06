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
    y: 1.0,
    z: 5.0
};

const COLOR_PALLETE = {
    vividpurple: "#A599FD",
    pinkred: "#EE54DA",
    skyblue: "#197CE4"
};

const SPHERE_POS = [
    { x: 1.7, y: 2.4, z: 6.3 },
    { x: -2.3, y: 0.0, z: 5.3 },
    { x: 0.7, y: -2.8, z: 4.8 }
];

export default class WebglManager {
    constructor(canvas) {
        this.canvas = canvas;

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.light = null;

        this.uniforms = null;

        this.color1 = [...this.hexToRgb(COLOR_PALLETE.vividpurple)];
        this.color2 = [...this.hexToRgb(COLOR_PALLETE.skyblue)];
        this.color3 = [...this.hexToRgb(COLOR_PALLETE.pinkred)];

        this.sphereMeshList = [];
    }

    init() {
        this.setupWebgl();
        this.resize();

        gsap.ticker.add(time => {
            this.uniforms.uTime.value = time;
            this.renderer.render(this.scene, this.camera);

            if (this.sphereMeshList) {
                this.sphereMeshList.forEach(mesh => {
                    mesh.position.x += Math.cos(time) * Math.random() * 0.001;
                    mesh.position.y +=
                        easing.easeInOutCubic(Math.sin(time * 0.1)) *
                        Math.random() *
                        0.001;
                });
            }
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
        this.renderer.setClearColor(new THREE.Color(0xffffff));

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight
        );
        this.camera.position.set(0, 0, +14);
        // plane
        this.planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
        // spehre
        this.sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32);

        this.uniforms = {
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uTime: { type: "f", value: 0 },
            uColor1: {
                type: "v3",
                value: new THREE.Vector3(
                    this.color1[0],
                    this.color1[1],
                    this.color1[2]
                )
            },
            uColor2: {
                type: "v3",
                value: new THREE.Vector3(
                    this.color2[0],
                    this.color2[1],
                    this.color2[2]
                )
            },
            uColor3: {
                type: "v3",
                value: new THREE.Vector3(
                    this.color3[0],
                    this.color3[1],
                    this.color3[2]
                )
            },
            uNoiseOffset1: { type: "f", value: 2.8 },
            uNoiseOffset2: { type: "f", value: 1.2 },
            uNoiseOffset3: { type: "f", value: 1.8 }
        };
        this.gradientShaderMaterial = new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: gradientFrag,
            vertexShader: vert
        });

        // マテリアルのパラメータ
        const MATERIAL_PARAM = {
            color: 0xffffff,
            specular: 0xffffff
        };
        const samplemesh = new THREE.MeshPhongMaterial(MATERIAL_PARAM);

        const textuerLoader = new THREE.TextureLoader();
        this.mat = new THREE.MeshPhongMaterial();

        textuerLoader.load(`${IMG_DIR}/3d_graphic_texture.jpg`, tex => {
            this.mat.map = tex;
            this.planeMesh = new THREE.Mesh(this.planeGeometry, this.mat);
            this.planeMesh.position.set(0.0, 0.0, 0.0);
            this.scene.add(this.planeMesh);
        });

        SPHERE_POS.forEach(pos => {
            const sphereMesh = new THREE.Mesh(this.sphereGeometry, samplemesh);
            sphereMesh.position.set(pos.x, pos.y, pos.z);
            this.scene.add(sphereMesh);
            this.sphereMeshList.push(sphereMesh);
        });

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

        this.uniforms.uResolution.value.x = this.renderer.domElement.width;
        this.uniforms.uResolution.value.y = this.renderer.domElement.height;
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
