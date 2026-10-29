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

  // na ordem em que aparecem na página (o MDN Flow não tem link no menu, mas encerra o "Como funciona")
  const SECTION_IDS = ["inicio", "projetos", "servicos", "como-funciona", "mdn-flow", "sobre", "contato"];
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

  function updateScrolled() {
    scrolled = window.scrollY > 8;
    updateHeader();
  }
  updateScrolled();

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

  // Com as cenas de rolagem as seções ficam altas e se sobrepõem (a próxima sobe por cima da
  // anterior), então a seção ativa é a última cuja borda de cima já passou do meio da tela.
  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
  let activeId = "";
  let activeTicking = false;

  function updateActiveSection() {
    activeTicking = false;
    const middle = window.innerHeight * 0.5;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= middle) current = section;
    });
    // No fim da página, marca a última seção (ela pode ser curta demais)
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    if (current && current.id !== activeId) {
      activeId = current.id;
      setActiveSection(activeId);
    }
  }

  function requestActiveSection() {
    if (activeTicking) return;
    activeTicking = true;
    window.requestAnimationFrame(updateActiveSection);
  }

  // um único ouvinte de rolagem: o cabeçalho é barato e atualiza na hora; a seção ativa (lê a
  // geometria das seções) espera o próximo quadro
  window.addEventListener(
    "scroll",
    () => {
      updateScrolled();
      requestActiveSection();
    },
    { passive: true },
  );
  window.addEventListener("resize", requestActiveSection);
  updateActiveSection();

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
    // Com as cenas de rolagem fixas (data-scenes="pin") o que está dentro do palco é conduzido
    // pela rolagem (js/scenes.js); a entrada única por observador ficaria brigando com ele.
    const pinnedScenes = root.dataset.scenes === "pin";
    const pending = Array.from(document.querySelectorAll("[data-reveal]")).filter(
      (el) =>
        el.getBoundingClientRect().top >= window.innerHeight &&
        !(pinnedScenes && el.closest("[data-pin]")),
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
