import WebglManager from "./lib/webglManager";
import { preventScroll } from "./lib/toggleScroll";
import gsap from "gsap";

const view = document.querySelector(".js-view");
const manager = new WebglManager(view);

// setting
gsap.set(".js-title", { yPercent: 100 });
gsap.set(".js-explain", { yPercent: 100 });

manager.init();
preventScroll();

// animation
const tl = gsap.timeline();
let texttl;
tl.set(".js-title", { opacity: 1 }, 0.3)
    .to(".js-title", 0.8, { yPercent: 0, ease: "sine.in" }, 0.4)
    .to(".js-overlay", 0.8, { opacity: 0, ease: "sine.in" }, "+=0.0")
    .to(
        ".js-gradient",
        0.8,
        {
            opacity: 0,
            ease: "sine.out",
            onStart: () => setTextAnimation()
        },
        "-=0.4"
    );

function setTextAnimation() {
    gsap.set(".js-explain", { opacity: 1 }, 0);
    gsap.to(".js-explain", 0.8, { yPercent: 0, ease: "sine.in", delay: 0.1 });
}
