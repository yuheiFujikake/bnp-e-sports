import WebGLHelper from "./_WebGLHelper";
import SmokeWebGL from "./_Smoke";
window.addEventListener("load", init);

function init() {
  const webGLHelper = new WebGLHelper(document.querySelector("#myCanvas"));
  const smokeWebGL = new SmokeWebGL(
    webGLHelper.renderer,
    webGLHelper.scene,
    webGLHelper.clock
  );
  smokeWebGL.init();
  animate();

  window.addEventListener("resize", () => {
    webGLHelper.onResize();
  });

  function animate() {
    requestAnimationFrame(animate);
    smokeWebGL.animate();
    webGLHelper.animate();
  }
}
