/*
 * Rolagem automática (JavaScript puro).
 *
 * A página desce sozinha, em ritmo contínuo, e para quando a pessoa mexe: toque, roda do mouse, teclas de
 * navegação, clique ou arrastar da barra. Um botão fixo (pausar/continuar) deixa o controle sempre à vista.
 *
 *  - Não inicia com "reduzir movimento" no aparelho, nem sem JS (o botão só existe quando este arquivo roda).
 *  - Começa sozinha ~2,5 s depois do carregamento, se a pessoa ainda não tiver mexido em nada.
 *  - Para no fim da página e quando a aba fica em segundo plano.
 *  - A velocidade acompanha a altura da tela (~9% da tela por segundo, entre 55 e 120 px/s).
 *  - Quem rola é o próprio navegador (scrollTo): as cenas de js/scenes.js seguem a rolagem normalmente.
 */
(function () {
  "use strict";

  try {
    const START_DELAY = 2500; // ms parado no início antes de começar sozinha
    const reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (reduceQuery && reduceQuery.matches) return;

    const root = document.documentElement;
    const doc = document;
    let running = false;
    let position = 0; // posição em decimais (scrollY arredonda em alguns navegadores)
    let last = 0;
    let frame = 0;
    let startTimer = 0;
    let touching = false;

    const button = doc.createElement("button");
    button.type = "button";
    button.className = "autoplay";
    button.innerHTML =
      '<svg class="autoplay__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path class="autoplay__pause" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>' +
      '<path class="autoplay__play" d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>' +
      '<span class="autoplay__label"></span>';
    const label = button.querySelector(".autoplay__label");
    doc.body.appendChild(button);

    const maxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight);
    const speed = () => Math.min(120, Math.max(55, window.innerHeight * 0.09)); // px por segundo

    function render() {
      button.dataset.state = running ? "playing" : "paused";
      button.setAttribute("aria-pressed", String(running));
      const text = running ? "Pausar rolagem" : "Rolagem automática";
      label.textContent = text;
      button.setAttribute("aria-label", running ? "Pausar a rolagem automática" : "Continuar a rolagem automática");
    }

    function tick(now) {
      if (!running) return;
      const dt = Math.min(64, now - last) / 1000; // limita saltos (aba lenta ou voltando)
      last = now;
      position += speed() * dt;
      const limit = maxScroll();
      if (position >= limit) {
        window.scrollTo({ top: limit, behavior: "instant" });
        stop();
        return;
      }
      window.scrollTo({ top: position, behavior: "instant" });
      frame = window.requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      window.clearTimeout(startTimer);
      if (maxScroll() - window.scrollY < 4) window.scrollTo({ top: 0, behavior: "instant" }); // no fim: recomeça
      position = window.scrollY;
      running = true;
      last = window.performance.now();
      render();
      frame = window.requestAnimationFrame(tick);
    }

    function stop() {
      window.clearTimeout(startTimer);
      if (!running) return render();
      running = false;
      window.cancelAnimationFrame(frame);
      render();
    }

    // qualquer gesto da pessoa para a rolagem (o que ela fizer depois já é rolagem dela)
    const halt = () => stop();
    window.addEventListener("wheel", halt, { passive: true });
    window.addEventListener("touchstart", () => { touching = true; halt(); }, { passive: true });
    window.addEventListener("touchend", () => { touching = false; }, { passive: true });
    window.addEventListener("touchcancel", () => { touching = false; }, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (event.target === button) return; // Enter/Espaço no botão têm o papel do próprio botão
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar", "Escape", "Tab"].includes(event.key)) halt();
    });
    // clique em links/menu/botões e arrastar da barra de rolagem (pointerdown fora da área do documento)
    window.addEventListener("pointerdown", (event) => {
      if (button.contains(event.target)) return;
      if (event.pointerType === "mouse" && event.clientX >= root.clientWidth) return halt(); // barra de rolagem
      if (event.target.closest && event.target.closest("a, button, summary, [role='button']")) halt();
    });
    // rolagem que não veio de nós (barra arrastada, âncora, foco): se fugir da posição esperada, para
    window.addEventListener(
      "scroll",
      () => {
        if (running && !touching && Math.abs(window.scrollY - position) > 3) halt();
      },
      { passive: true },
    );
    doc.addEventListener("visibilitychange", () => { if (doc.hidden) halt(); });
    if (reduceQuery) {
      const onChange = (event) => { if (event.matches) { stop(); button.hidden = true; } };
      if (reduceQuery.addEventListener) reduceQuery.addEventListener("change", onChange);
      else if (reduceQuery.addListener) reduceQuery.addListener(onChange);
    }

    button.addEventListener("click", () => (running ? stop() : start()));

    render();
    // começa sozinha se a pessoa não mexeu em nada nos primeiros segundos
    startTimer = window.setTimeout(() => {
      if (!doc.hidden && window.scrollY < 8) start();
    }, START_DELAY);
  } catch (error) {
    if (window.console) console.error("[MDN] Falha na rolagem automática:", error);
  }
})();
