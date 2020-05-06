import WebglManager from "./lib/webglManager";

const view = document.querySelector(".js-view");
const manager = new WebglManager(view);

manager.init();
