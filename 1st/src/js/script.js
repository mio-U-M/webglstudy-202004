import WebglManager from "./lib/webglManager";
import gsap from "gsap";

const view = document.querySelector(".js-view");
const manager = new WebglManager(view);

// setting
gsap.set(".js-title", { yPercent: 100 });
gsap.set(".js-explain", { opacity: 0 });
manager.init();

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
            onComplete: () => setTextAnimation()
        },
        "-=0.4"
    );

manager.on("rotate", () => {
    texttl.pause();
    gsap.to(".js-explain", 0.5, { opacity: 0 });
});

manager.on("stop", () => {
    texttl.play("beginning");
});

function setTextAnimation() {
    texttl = gsap.timeline({ repeat: -1 });
    texttl.addLabel("beginning");
    texttl.set(".js-explain", { opacity: 0 });
    texttl.to(".js-explain", 1.0, { opacity: 1, ease: "sine.in" }, 0);
    texttl.to(".js-explain", 1.0, { opacity: 0, ease: "sine.in" }, "+=0.0");
}
