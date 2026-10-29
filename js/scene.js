/*
 * Cenas 3D e brilho que segue o ponteiro (JavaScript puro, sem dependências).
 *
 * - [data-stage] e [data-tilt-scene]: inclinam conforme o ponteiro (mouse, caneta ou dedo
 *   arrastando na horizontal) e conforme a posição na rolagem. O JS só escreve variáveis CSS
 *   (--rx, --ry, --px, --gx, --gy, --sp); toda a geometria 3D está no CSS.
 * - [data-spotlight]: recebe --mx/--my com a posição do mouse, para o brilho do fundo.
 *
 * Nada aqui é necessário para ler ou usar a página: sem JS, ou com prefers-reduced-motion,
 * as cenas ficam paradas no ângulo inicial definido no CSS.
 */
(function () {
  "use strict";

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasObserver = "IntersectionObserver" in window;
  const MAX_TILT = { stage: 9, case: 7 }; // graus
  const EASE = 0.12; // suavização do acompanhamento (0 a 1)
  const EPSILON = 0.004;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const round = (value) => Math.round(value * 1000) / 1000;

  /* ---------- Cenas ---------- */
  const scenes = Array.from(document.querySelectorAll("[data-stage], [data-tilt-scene]")).map(
    (el) => ({
      el,
      kind: el.hasAttribute("data-stage") ? "stage" : "case",
      visible: !hasObserver,
      pointer: false,
      // valores atuais e alvos do ponteiro (-1 a 1)
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      written: {},
    }),
  );

  let frameRequested = false;
  let wasReduced = reduceQuery.matches;

  function write(scene, name, value) {
    if (scene.written[name] === value) return;
    scene.written[name] = value;
    scene.el.style.setProperty(name, value);
  }

  function resetScene(scene) {
    scene.x = scene.y = scene.tx = scene.ty = 0;
    scene.pointer = false;
    scene.written = {};
    ["--rx", "--ry", "--px", "--gx", "--gy", "--sp"].forEach((name) =>
      scene.el.style.removeProperty(name),
    );
    scene.el.removeAttribute("data-active");
  }

  function update(scene) {
    const max = MAX_TILT[scene.kind];
    scene.x += (scene.tx - scene.x) * EASE;
    scene.y += (scene.ty - scene.y) * EASE;
    if (Math.abs(scene.tx - scene.x) < EPSILON) scene.x = scene.tx;
    if (Math.abs(scene.ty - scene.y) < EPSILON) scene.y = scene.ty;

    write(scene, "--ry", String(round(scene.x * max)));
    write(scene, "--rx", String(round(-scene.y * max)));
    write(scene, "--px", String(round(scene.x)));
    write(scene, "--gx", round((scene.x + 1) * 50) + "%");
    write(scene, "--gy", round((scene.y + 1) * 50) + "%");

    // posição na rolagem: só os cartões de projeto usam (inclinam conforme cruzam a tela)
    if (scene.kind === "case") {
      const rect = scene.el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2 - vh / 2;
      write(scene, "--sp", String(round(clamp(center / (vh / 2 + rect.height / 2), -1, 1))));
    }

    // continua só enquanto ainda está acompanhando o alvo; cada movimento do ponteiro pede novo quadro
    return scene.x !== scene.tx || scene.y !== scene.ty;
  }

  function frame() {
    frameRequested = false;
    if (reduceQuery.matches) {
      // "Reduzir movimento" ligado com a página aberta: volta ao ângulo inicial
      if (!wasReduced) scenes.forEach(resetScene);
      wasReduced = true;
      return;
    }
    wasReduced = false;
    let again = false;
    scenes.forEach((scene) => {
      if (scene.visible && update(scene)) again = true;
    });
    if (again) requestFrame();
  }

  function requestFrame() {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(frame);
  }

  function pointTo(scene, event) {
    const rect = scene.el.getBoundingClientRect();
    scene.tx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    scene.ty = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    if (!scene.pointer) {
      scene.pointer = true;
      scene.el.setAttribute("data-active", "true");
    }
    requestFrame();
  }

  function release(scene) {
    scene.pointer = false;
    scene.tx = scene.ty = 0;
    scene.el.removeAttribute("data-active");
    requestFrame();
  }

  scenes.forEach((scene) => {
    scene.el.addEventListener("pointermove", (event) => {
      if (!reduceQuery.matches) pointTo(scene, event);
    });
    scene.el.addEventListener("pointerleave", () => release(scene));
    scene.el.addEventListener("pointercancel", () => release(scene));
    scene.el.addEventListener("pointerup", (event) => {
      if (event.pointerType === "touch") release(scene);
    });
  });

  // Só trabalha (e só pede "will-change" ao CSS) enquanto a cena está na tela
  if (hasObserver) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scene = scenes.find((item) => item.el === entry.target);
          if (!scene) return;
          scene.visible = entry.isIntersecting;
          scene.el.dataset.live = String(entry.isIntersecting);
        });
        requestFrame();
      },
      { rootMargin: "10% 0px 10% 0px" },
    );
    scenes.forEach((scene) => visibilityObserver.observe(scene.el));
  }

  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame, { passive: true });

  // Mudança da preferência com a página aberta (o quadro acima faz a limpeza)
  // addEventListener em matchMedia não existe no Safari 13 e anteriores
  if (reduceQuery.addEventListener) reduceQuery.addEventListener("change", requestFrame);
  else if (reduceQuery.addListener) reduceQuery.addListener(requestFrame);

  requestFrame();

  /* ---------- Brilho que segue o mouse ---------- */
  let spotlightFrame = 0;
  document.querySelectorAll("[data-spotlight]").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || reduceQuery.matches || spotlightFrame) return;
      spotlightFrame = window.requestAnimationFrame(() => {
        spotlightFrame = 0;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", round(((event.clientX - rect.left) / rect.width) * 100) + "%");
        el.style.setProperty("--my", round(((event.clientY - rect.top) / rect.height) * 100) + "%");
      });
    });
  });
})();
