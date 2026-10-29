/*
 * Cenas de rolagem (scrollytelling) da MDN Solutions. JavaScript puro, sem dependências.
 *
 * A rolagem continua nativa: nada é capturado, bloqueado ou simulado. Este arquivo só lê
 * window.scrollY, calcula o progresso de cada cena e escreve variáveis CSS; toda a
 * geometria (translate, scale, rotate, 3D) está nos arquivos de css/scenes/.
 *
 * Cada elemento [data-scene] ("trilho") recebe:
 *   --e  entrada   0 a 1, enquanto o topo do trilho sobe do rodapé ao topo da tela
 *   --q  história  0 a 1, o avanço da cena em si
 *                  (trilho fixado: distância rolada com o palco preso; demais: passagem pela tela;
 *                   data-q="leave": quanto do trilho já saiu pelo topo;
 *                   data-q="end": da chegada do trilho à tela até o fim da página, para a última seção)
 *   --x  saída     0 a 1, depois da história (com data-tail, é a "cortina" em que a próxima
 *                  seção cobre o palco; sem data-tail, é o palco saindo da tela)
 *   --st posição   0 a N-1, só com data-stations="N": a estação atual, com pausas
 *                  (data-hold, 0 a 0.45) para cada item "descansar" antes do próximo
 * e a raiz recebe --page (0 a 1, progresso do documento).
 * Os valores avançam suavizados (inércia curta); ao parar de rolar, o loop termina sozinho.
 * Voltar a rolar para cima desfaz tudo na mesma proporção.
 *
 * Modos (atributo data-scenes no <html>, definido também por um script no <head>):
 *   "pin"  telas largas (>= 60em e >= 36em de altura): trilhos [data-pin] viram palcos fixos
 *   "lite" telas menores: sem palco fixo; as cenas viram efeitos leves na rolagem normal
 *   ausente: "reduzir movimento" ligado ou sem JS; a página fica estática e em fluxo normal
 */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pinQuery = window.matchMedia("(min-width: 60em) and (min-height: 36em)");
  // o CSS das cenas usa svh, cqw, overflow: clip e translate/scale/rotate individuais; sem eles, estático
  const css = window.CSS;
  const supported = Boolean(
    css && css.supports && css.supports("height: 1svh") && css.supports("width: 1cqw") && css.supports("overflow: clip") && css.supports("translate: 1px"),
  );

  const SMOOTH = 0.16; // fração do caminho percorrida por quadro (a 60 fps)
  const EPSILON = 0.0006;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (t) => t * t * (3 - 2 * t);
  const fixed = (value) => String(Math.round(value * 10000) / 10000);

  const scenes = Array.from(document.querySelectorAll("[data-scene]")).map((el) => ({
    el,
    box: el.querySelector("[data-pinbox]"),
    pin: el.hasAttribute("data-pin"),
    liteOnly: el.hasAttribute("data-lite-only"),
    tail: Number.parseFloat(el.dataset.tail || "0"),
    stations: Number.parseInt(el.dataset.stations || "0", 10),
    hold: clamp(Number.parseFloat(el.dataset.hold || "0.2"), 0, 0.45),
    leave: el.dataset.q === "leave",
    end: el.dataset.q === "end",
    enabled: true,
    pinned: false,
    top: 0,
    height: 0,
    boxHeight: 0,
    anchorTop: 0,
    cur: { e: 0, q: 0, x: 0 },
    tgt: { e: 0, q: 0, x: 0 },
    written: {},
    live: null,
  }));

  let vh = window.innerHeight;
  let docMax = 0; // maior rolagem possível (fim da página)
  let raf = 0;
  let last = 0;
  let snap = true; // primeiro quadro (e depois de medir de novo): sem inércia
  let mode = null;

  /* ---------- Estações: converte o progresso em "qual item está em foco", com pausas ---------- */
  function station(q, count, hold) {
    if (count < 2) return 0;
    const t = clamp(q) * (count - 1);
    const i = Math.min(count - 2, Math.floor(t));
    const f = t - i;
    return i + smooth(clamp((f - hold) / (1 - 2 * hold)));
  }

  /* ---------- Modo ---------- */
  function applyMode() {
    const next = !supported || reduceQuery.matches ? null : pinQuery.matches ? "pin" : "lite";
    mode = next;
    if (next) {
      root.setAttribute("data-scenes", next);
      root.setAttribute("data-engine", "on");
    } else {
      root.removeAttribute("data-scenes");
      root.removeAttribute("data-engine");
    }
    scenes.forEach((s) => {
      s.pinned = next === "pin" && s.pin;
      s.enabled = next !== null && !(s.liteOnly && next === "pin");
      if (!s.enabled) clearScene(s);
    });
  }

  function clearScene(s) {
    s.written = {};
    s.live = null;
    ["--e", "--q", "--x", "--st"].forEach((name) => s.el.style.removeProperty(name));
    s.el.removeAttribute("data-live");
    s.el.removeAttribute("data-covered");
  }

  /* ---------- Medidas (só quando o layout muda) ---------- */
  function measure() {
    vh = window.innerHeight;
    const y = window.scrollY;
    docMax = Math.max(0, root.scrollHeight - vh);
    scenes.forEach((s) => {
      if (!s.enabled) return;
      const rect = s.el.getBoundingClientRect();
      s.top = rect.top + y;
      s.height = rect.height;
      s.boxHeight = s.box ? s.box.offsetHeight : vh;
      // data-q="end": elemento (seletor em data-q-anchor) que marca a chegada da cena
      const anchor = s.end && s.el.dataset.qAnchor ? s.el.querySelector(s.el.dataset.qAnchor) : null;
      s.anchorTop = anchor ? anchor.getBoundingClientRect().top + y : 0;
    });
    snap = true;
    request();
  }

  /* ---------- Progresso de cada cena ---------- */
  function target(s, y) {
    const t = s.tgt;
    const H = s.height;
    if (s.pinned) {
      const box = s.boxHeight;
      const pinLength = Math.max(1, H - box);
      const tail = Math.min(pinLength - 1, s.tail * box);
      const main = Math.max(1, pinLength - tail);
      t.e = clamp((y + box - s.top) / box);
      t.q = clamp((y - s.top) / main);
      t.x = tail > 0 ? clamp((y - s.top - main) / tail) : clamp((y - s.top - pinLength) / box);
      return;
    }
    const entered = (y + vh - s.top) / (H + vh);
    t.e = clamp((y + vh - s.top) / vh);
    if (s.end) {
      // última seção da página: nunca chega ao meio da tela, então o progresso vai até o fim do documento
      // com âncora: vai de "âncora a 72% da altura da tela" até "a 25%" (ou o fim da página)
      const from = s.anchorTop ? s.anchorTop - vh * 0.72 : s.top - vh * 0.85;
      const to = s.anchorTop ? Math.min(docMax, s.anchorTop - vh * 0.25) : docMax;
      t.q = clamp((y - from) / Math.max(1, to - from));
    } else {
      t.q = s.leave ? clamp((y - s.top) / Math.max(1, H)) : clamp((entered - 0.16) / 0.68);
    }
    t.x = clamp((y - (s.top + H - vh)) / vh);
  }

  function ease(s, dt) {
    const k = snap ? 1 : 1 - Math.pow(1 - SMOOTH, dt / 16.667);
    let moving = false;
    ["e", "q", "x"].forEach((key) => {
      const diff = s.tgt[key] - s.cur[key];
      if (Math.abs(diff) < EPSILON) {
        s.cur[key] = s.tgt[key];
      } else {
        s.cur[key] += diff * k;
        moving = true;
      }
    });
    return moving;
  }

  function setVar(s, name, value) {
    const text = fixed(value);
    if (s.written[name] === text) return;
    s.written[name] = text;
    s.el.style.setProperty(name, text);
  }

  function write(s, y) {
    setVar(s, "--e", s.cur.e);
    setVar(s, "--q", s.cur.q);
    setVar(s, "--x", s.cur.x);
    if (s.stations > 1) setVar(s, "--st", station(s.cur.q, s.stations, s.hold));

    // só pede will-change ao CSS enquanto a cena está perto da tela
    const near = y + vh * 2 > s.top && y - vh < s.top + s.height;
    if (s.live !== near) {
      s.live = near;
      s.el.setAttribute("data-live", String(near));
    }
    // palco totalmente coberto pela seção seguinte: sai da árvore de foco e deixa de pintar
    if (s.pinned && s.tail > 0) s.el.toggleAttribute("data-covered", s.cur.x >= 0.999);
  }

  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(64, now - last) : 16.667;
    last = now;
    const y = window.scrollY;
    let moving = false;

    scenes.forEach((s) => {
      if (!s.enabled) return;
      target(s, y);
      if (ease(s, dt)) moving = true;
      write(s, y);
    });
    snap = false;

    const max = root.scrollHeight - vh;
    root.style.setProperty("--page", fixed(max > 0 ? clamp(y / max) : 0));

    if (moving) request();
    else last = 0;
  }

  function request() {
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  /* ---------- Links para os projetos do trilho horizontal ---------- */
  function goToPanel(panel, behavior) {
    const track = panel.closest("[data-scene]");
    const s = scenes.find((item) => item.el === track);
    if (!s || !s.pinned || s.stations < 2) return false;
    const index = Number.parseInt(panel.dataset.railPanel || "0", 10);
    const main = Math.max(1, s.height - s.boxHeight - s.tail * s.boxHeight);
    const top = s.top + (index / (s.stations - 1)) * main;
    window.scrollTo({ top, behavior });
    return true;
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link || mode !== "pin") return;
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    const panel = id ? document.getElementById(id) : null;
    if (panel && panel.hasAttribute("data-rail-panel") && goToPanel(panel, "smooth")) {
      event.preventDefault();
    }
  });

  // Foco por teclado dentro de um painel que não está em destaque: leva o trilho até ele
  document.addEventListener("focusin", (event) => {
    if (mode !== "pin") return;
    const panel = event.target.closest && event.target.closest("[data-rail-panel]");
    if (panel) goToPanel(panel, "auto");
  });

  /* ---------- Início ---------- */
  function setup() {
    applyMode();
    measure();

    // Abriu a página com #projeto na URL: o navegador não sabe onde fica o painel no trilho
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    if (target && target.hasAttribute("data-rail-panel")) {
      window.requestAnimationFrame(() => goToPanel(target, "auto"));
    }
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", () => {
    applyMode();
    measure();
  });
  window.addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if ("ResizeObserver" in window) {
    let height = document.body.offsetHeight;
    new ResizeObserver(() => {
      if (document.body.offsetHeight !== height) {
        height = document.body.offsetHeight;
        measure();
      }
    }).observe(document.body);
  }

  const onModeChange = () => {
    applyMode();
    measure();
  };
  reduceQuery.addEventListener("change", onModeChange);
  pinQuery.addEventListener("change", onModeChange);

  setup();
})();
