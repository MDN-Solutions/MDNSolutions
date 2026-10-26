/*
 * Efeitos 2D/3D da página (JavaScript puro). Só escreve variáveis CSS;
 * quem desenha é o css/effects.css. Desligado com movimento reduzido.
 *
 * 1. Hero: inclina o painel e desloca as camadas conforme o mouse (ou o dedo)
 * 2. Foco de luz do hero segue o ponteiro
 * 3. Cards de serviço e benefícios: inclinam e reluzem (só com mouse)
 * 4. Seção "Sobre": o planeta inclina com o mouse
 */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v) => Math.max(-1, Math.min(1, v));

  /* ---------- 1 e 2. Hero ---------- */
  const hero = document.querySelector(".hero");
  const visual = document.querySelector(".hero-visual");

  if (hero && visual) {
    let frame = 0;
    let next = null;

    const apply = () => {
      frame = 0;
      const { nx, ny, x, y } = next;
      visual.style.setProperty("--ry", (nx * 20).toFixed(2) + "deg");
      visual.style.setProperty("--rx", (ny * -14).toFixed(2) + "deg");
      visual.style.setProperty("--px", nx.toFixed(3));
      visual.style.setProperty("--py", ny.toFixed(3));
      hero.style.setProperty("--mx", x + "px");
      hero.style.setProperty("--my", y + "px");
    };

    const move = (event) => {
      const box = visual.getBoundingClientRect();
      const heroBox = hero.getBoundingClientRect();
      next = {
        nx: clamp((event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 3)),
        ny: clamp((event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2.4)),
        x: Math.round(event.clientX - heroBox.left),
        y: Math.round(event.clientY - heroBox.top),
      };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const reset = () => {
      ["--rx", "--ry", "--px", "--py"].forEach((name) => visual.style.removeProperty(name));
    };

    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);

    // Celular: sem mouse, o painel inclina de leve conforme a página rola
    if (!fine) {
      const onScroll = () => {
        const progress = clamp(window.scrollY / (hero.offsetHeight || 1));
        visual.style.setProperty("--rx", (progress * 10).toFixed(2) + "deg");
        visual.style.setProperty("--py", (progress * -0.8).toFixed(3));
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- 3. Cards ---------- */
  if (fine) {
    document.querySelectorAll(".services__card, .benefits__item").forEach((card) => {
      card.setAttribute("data-tilt", "");
      const glare = document.createElement("span");
      glare.className = "glare";
      glare.setAttribute("aria-hidden", "true");
      card.appendChild(glare);

      let frame = 0;
      card.addEventListener(
        "pointermove",
        (event) => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            const box = card.getBoundingClientRect();
            const x = (event.clientX - box.left) / box.width;
            const y = (event.clientY - box.top) / box.height;
            card.classList.add("is-tilting");
            card.style.setProperty("--ry", ((x - 0.5) * 12).toFixed(2) + "deg");
            card.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
            card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
            card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
          });
        },
        { passive: true }
      );
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  /* ---------- 4. Sobre ---------- */
  const about = document.querySelector(".about__visual");
  if (about && fine) {
    about.addEventListener(
      "pointermove",
      (event) => {
        const box = about.getBoundingClientRect();
        const nx = clamp((event.clientX - (box.left + box.width / 2)) / (box.width / 2));
        const ny = clamp((event.clientY - (box.top + box.height / 2)) / (box.height / 2));
        about.style.setProperty("--ry", (nx * 14).toFixed(2) + "deg");
        about.style.setProperty("--rx", (ny * -14).toFixed(2) + "deg");
      },
      { passive: true }
    );
    about.addEventListener("pointerleave", () => {
      about.style.removeProperty("--rx");
      about.style.removeProperty("--ry");
    });
  }
})();
