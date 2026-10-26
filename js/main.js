/*
 * Interações da página MDN Solutions (JavaScript puro, sem dependências).
 *
 * 1. Header fica sólido ao rolar a página
 * 2. Link do menu da seção visível fica marcado como ativo
 * 3. Menu mobile (abrir/fechar, Esc, foco, trava de rolagem)
 * 4. Animação de entrada dos elementos com [data-reveal]
 * 5. Ano atual no rodapé
 *
 * As cenas 3D e o brilho que segue o mouse ficam em js/scene.js.
 */
(function () {
  "use strict";

  const SECTION_IDS = ["inicio", "projetos", "servicos", "como-funciona", "sobre", "contato"];
  const DESKTOP_QUERY = "(min-width: 60em)"; // acima disso o menu mobile some
  const MAX_REVEAL_STAGGER = 4; // máximo de itens escalonados por vez

  const root = document.documentElement;
  const header = document.querySelector(".header");
  const menuButton = document.querySelector(".header__menu-button");
  const menuPanel = document.getElementById("menu-mobile");
  const main = document.getElementById("conteudo");
  const footer = document.querySelector(".footer");
  const hasObserver = "IntersectionObserver" in window;

  let menuOpen = false;
  let scrolled = false;

  /* ---------- 1. Header sólido ---------- */
  function updateHeader() {
    header.dataset.solid = String(scrolled || menuOpen);
  }

  function onScroll() {
    scrolled = window.scrollY > 8;
    updateHeader();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Link ativo no menu ---------- */
  const navLinks = document.querySelectorAll(".header__nav-link, .header__panel-link");

  function setActiveSection(id) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (hasObserver) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  // No fim da página, marca a última seção (ela pode ser curta demais)
  window.addEventListener(
    "scroll",
    () => {
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) {
        setActiveSection(SECTION_IDS[SECTION_IDS.length - 1]);
      }
    },
    { passive: true },
  );

  /* ---------- 3. Menu mobile ---------- */
  const firstMenuLink = menuPanel.querySelector("a");
  let previousOverflow = "";

  function onMenuKeydown(event) {
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuButton.focus();
    }
  }

  function setMenuOpen(open) {
    if (open === menuOpen) return;
    menuOpen = open;

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menuPanel.dataset.open = String(open);
    main.inert = open;
    footer.inert = open;

    if (open) {
      previousOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      firstMenuLink.focus();
      document.addEventListener("keydown", onMenuKeydown);
    } else {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onMenuKeydown);
    }

    updateHeader();
  }

  menuButton.addEventListener("click", () => setMenuOpen(!menuOpen));

  // Fecha o menu ao clicar em qualquer link do painel, na marca ou no "pular para o conteúdo"
  document
    .querySelectorAll(".header__panel-link, .header__brand, .skip-link")
    .forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));

  // Fecha o menu se a tela aumentar para o tamanho desktop
  window.matchMedia(DESKTOP_QUERY).addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });

  /* ---------- 4. Animação de entrada ([data-reveal]) ---------- */
  // Só anima o que ainda está abaixo da dobra; o que já está visível aparece direto.
  if (hasObserver && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    const pending = Array.from(document.querySelectorAll("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top >= window.innerHeight,
    );
    const stagger = getComputedStyle(root).getPropertyValue("--stagger").trim() || "90ms";

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, index) => {
            const el = entry.target;
            const step = Math.min(index, MAX_REVEAL_STAGGER);
            el.style.setProperty("--reveal-delay", `calc(${stagger} * ${step})`);
            el.dataset.revealState = "shown";
            revealObserver.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    pending.forEach((el) => {
      el.dataset.revealState = "hidden";
      revealObserver.observe(el);
    });
  }

  /* ---------- 5. Ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
