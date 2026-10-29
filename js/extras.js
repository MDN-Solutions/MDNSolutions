/*
 * Extras de movimento da página MDN Solutions (JavaScript puro, sem dependências).
 *
 * 1. Faixa de projetos: liga a rolagem automática e o botão de pausa
 * 2. Numerais de "Como funciona" contam de 0 até o número ao entrar na tela (uma vez)
 * 3. Porcentagem de leitura no header (só números; não é movimento)
 *
 * Sem este arquivo a página funciona igual: a faixa vira lista rolável e os numerais ficam prontos.
 */
(function () {
  "use strict";

  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- 1. Faixa de projetos ---------- */
  const strip = document.querySelector("[data-strip]");
  if (strip) {
    const button = strip.querySelector(".strip__pause");
    const label = strip.querySelector(".strip__pause-label");

    const sync = () => {
      const run = !reduceQuery.matches;
      strip.toggleAttribute("data-ready", run);
      button.hidden = !run;
      if (!run) {
        delete strip.dataset.paused;
        button.setAttribute("aria-pressed", "false");
        label.textContent = "Pausar faixa";
      }
    };

    button.addEventListener("click", () => {
      const paused = strip.toggleAttribute("data-paused");
      button.setAttribute("aria-pressed", String(paused));
      label.textContent = paused ? "Retomar faixa" : "Pausar faixa";
    });

    reduceQuery.addEventListener("change", sync);
    sync();

    // Só roda enquanto a faixa está na tela (economiza bateria)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          strip.querySelector(".strip__track").style.animationPlayState =
            entry.isIntersecting && !strip.hasAttribute("data-paused") ? "" : "paused";
        },
        { threshold: 0.05 },
      ).observe(strip);
    }
  }

  /* ---------- 2. Numerais de "Como funciona" ---------- */
  const numerals = Array.from(document.querySelectorAll(".process__number"));
  // no palco fixo (data-scenes="pin") os numerais acendem com a linha do tempo, então não contam
  if (
    numerals.length &&
    "IntersectionObserver" in window &&
    !reduceQuery.matches &&
    document.documentElement.dataset.scenes !== "pin"
  ) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countObserver.unobserve(entry.target);
          const el = entry.target;
          const target = Number.parseInt(el.dataset.final, 10);
          const start = performance.now();
          const DURATION = 900;
          const tick = (now) => {
            const progress = Math.min((now - start) / DURATION, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(target * eased)).padStart(2, "0");
            if (progress < 1 && !reduceQuery.matches) window.requestAnimationFrame(tick);
            else el.textContent = el.dataset.final;
          };
          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 },
    );
    numerals.forEach((el) => {
      el.dataset.final = el.textContent.trim();
      el.textContent = "00";
      countObserver.observe(el);
    });
  }

  /* ---------- 3. Porcentagem de leitura ---------- */
  const pct = document.querySelector("[data-read-pct]");
  if (pct) {
    pct.parentElement.hidden = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.round(Math.min(Math.max(window.scrollY / max, 0), 1) * 100) : 0;
      pct.textContent = String(value);
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!frame) frame = window.requestAnimationFrame(update);
      },
      { passive: true },
    );
    update();
  }
})();
