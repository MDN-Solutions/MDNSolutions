# MDN Solutions — site estático

Abra `index.html` direto no navegador. Não precisa de build nem de servidor (para testar do jeito
que o Vercel serve, use `python3 -m http.server 8000` dentro desta pasta).

```
index.html                 Conteúdo da página (seções marcadas com <!-- ===== NOME ===== -->)
robots.txt                 Libera a indexação e aponta para o sitemap
sitemap.xml                Páginas do site para o Google (hoje, só a página inicial)
og-image.png               Imagem que aparece ao compartilhar o link (1200×630)
css/
  base.css                 Fontes, variáveis (cores, tamanhos, espaçamentos), reset e utilitários
  components.css           Botões, logo e molduras de dispositivo (navegador e celular)
  header.css               Header fixo e menu mobile
  footer.css               Rodapé
  sections/                Um arquivo por seção: hero, projects, services, flow (MDN Flow), process, about, contact
  motion.css               Movimento extra (entradas escalonadas, micro-interações, barra de progresso)
  scenes/                  Cenas de rolagem (scrollytelling): core + hero, projects, services, process,
                           flow, about e closing
js/main.js                 Header, menu, link ativo, entrada ao rolar, ano no rodapé
js/scene.js                Inclinação 3D das cenas e brilho que segue o mouse
js/scenes.js               Motor das cenas de rolagem (lê a rolagem e escreve --e, --q, --x, --st)
js/extras.js               Numerais que contam e % de leitura
assets/                    Fontes, logo, ícones e capturas dos projetos (assets/projects/)
```

## Como editar

- **Textos e links:** em `index.html`. Os links do WhatsApp seguem o formato
  `https://wa.me/5581998576040?text=<mensagem codificada>`.
- **Cores e espaçamentos globais:** variáveis no topo de `css/base.css` (ex.: `--c-violet`).
- **Estilo de uma seção:** arquivo com o nome dela em `css/sections/`. A coreografia de rolagem de
  cada uma fica em `css/scenes/` (veja "Cenas de rolagem" abaixo).
  As classes seguem o padrão `bloco__elemento--modificador` (ex.: `.case__title`).
- **Classes compartilhadas** (em `base.css`): `.section` (espaço do topo), `.section-head` e
  `.section-kicker` (legenda + título de seção), `.section-title`, `.lead`, `.location` e `.icon`.
- **Ícones:** ficam num sprite no início do `<body>`. Para usar:
  `<svg class="icon" width="20" height="20" aria-hidden="true"><use href="#icon-whatsapp" /></svg>`
- **Animação de entrada:** adicione `data-reveal="up"` a qualquer elemento.
- **Alvo de toque:** links e botões usam `min-height: var(--tap)` (44px). Mantenha em novos links.

## Projetos (seção "Projetos" e cena do hero)

Cada projeto é um `<li class="case">` em `index.html`, com capturas em `assets/projects/`:
`<nome>-desktop.webp` (1200×750, telas retina), `<nome>-desktop-sm.webp` (800×500, usada pelo
`srcset` e pelo hero) e `<nome>-mobile.webp` (300×649). Mantenha as capturas leves (WebP, qualidade
~70): elas são a maior parte do peso da página.

- **Só entra o que dá para comprovar.** Os textos e a ficha ("Seções", "Estado") foram conferidos no
  código de cada site. Ao atualizar um projeto, confira de novo; não acrescente números, depoimentos
  ou prazos que o cliente não tenha confirmado.
- **Link para o site no ar:** cada projeto tem o botão "Visitar site" (`.case__link`, abre em nova aba).
  Trio Vilela (`https://trio-vilela.vercel.app/`) e Tio Pet (`https://tio-pet.vercel.app/`) vêm dos
  nomes dos projetos no Vercel da MDN e foram conferidos pelo conteúdo de cada página; Studio Monique
  Marques (`https://monique-megahair.vercel.app/`) foi informado pela MDN e o site está "Em
  desenvolvimento". Só publique um endereço confirmado; se um site mudar de endereço ou sair do ar,
  atualize ou remova o link do projeto. Modelo (dentro de `.case__body`, depois da ficha):
  `<div class="case__actions"><a class="button button--secondary button--sm case__link" href="https://…" target="_blank" rel="noopener noreferrer"><span>Visitar site</span><svg class="icon" width="16" height="16" aria-hidden="true"><use href="#icon-arrow-up-right" /></svg><span class="visually-hidden">do NOME (abre em nova aba)</span></a></div>`
- **Capturas no hero:** a animação "do papel ao site" do hero usa `tiopet-desktop-sm.webp` e
  `tiopet-mobile.webp`. Se trocar essas imagens, confira o hero (as molduras do desenho têm
  proporção fixa).
- **Novo projeto:** copie um `<li class="case">`, troque textos e imagens e use `case--flip` para
  alternar o lado da imagem. A numeração (01, 02…) é automática.
- **Autorização:** nomes, marcas e capturas de clientes precisam do OK deles. Isso vale em especial
  para o Studio Monique Marques (a captura mostra a própria cliente).

## Endereço do site, Google e compartilhamento

- O endereço `https://www.mdnsolutions.com.br/` aparece em `index.html` (canonical, `og:url`,
  `og:image` e dados estruturados), em `robots.txt` e em `sitemap.xml`. Se o domínio principal
  mudar, troque nesses lugares.
- `og-image.png` deve ficar em 1200×630 (proporção 1,91:1) e leve; a atual tem 177 KB. Para trocar
  a arte, substitua o arquivo mantendo o nome. Redes sociais guardam a imagem antiga em cache por um
  tempo.
- Ao incluir novas páginas, acrescente-as ao `sitemap.xml`.
- Os dados estruturados (`Organization`) só trazem informações que já estão no site. Não acrescente
  endereço, avaliações ou horários que não sejam reais e visíveis na página.

## Sistema visual

Linguagem: preto, grafite e branco, com violeta só como luz (brilhos e pontos de destaque). Detalhes de
"planta de projeto": linhas de cota (legendas e sublinhado do hero), quadriculado fino, marcas de
canto e fichas técnicas, para reforçar a ideia de solução feita sob medida.

Ritmo de cor ao longo da página (para não repetir a mesma seção escura com brilho e cartões): hero,
Projetos e Como funciona em preto; **Serviços em tom papel** (respiro claro); **MDN Flow em índigo**
(o produto próprio ganha um palco de outra cor); Sobre em preto com anéis em 3D; Contato num cartão
de vidro escuro.

| Item | Valor | Uso |
| --- | --- | --- |
| `--c-ink` | `#000` | Fundo da página |
| `--c-graphite`, `--c-graphite-2` | `#101010`, `#161616` | Cards e painéis |
| `--c-line`, `--c-line-strong` | `#242424`, `#3b3b3b` | Divisores e bordas |
| `--c-pencil` | `#9b9b9b` | Texto secundário (7,5:1 sobre o fundo; ainda passa de 4,5:1 com ~25% de apagado na cortina entre seções) |
| `--c-chalk` | `#c4c4c4` | Texto corrido (12:1 sobre o fundo) |
| `--c-paper`, `--c-white` | `#f3f3f3`, `#fff` | Títulos e botão principal |
| `--c-violet` | `139 108 255` | Acento da marca: brilhos e destaques, nunca como cor de texto |
| `--grid-line` | branco a 5,5% | Quadriculado dos fundos |
| `[data-tone="paper"]` | `--c-ink #efece4`, `--c-graphite #e6e2d8`, `--c-paper #1a1921` (texto), `--c-white #0c0b11` (texto mais forte), `--c-violet 92 58 240` | Seção clara (Serviços): os mesmos tokens são reatribuídos no escopo, então os componentes não mudam. Contrastes: texto 10,6:1, secundário 6:1, violeta 5,4:1 |

- **Tipografia:** Bricolage Grotesque (variável, pesos 200–800), escala fluida com `clamp()`
  (`--fs-*`, incluindo `--fs-hero`). Legendas em caixa alta com espaçamento largo. O mascote da logo
  nunca muda de cor.
- **Formas:** raios `--r-sm` 12px, `--r-md` 20px, `--r-lg` 32px e `--r-pill`.
- **Espaço:** `--space-section` entre seções; container de `75rem`.

## Movimento e 3D

Todo movimento fica desligado com `prefers-reduced-motion: reduce` (o conteúdo aparece pronto e as
cenas ficam paradas). Sem JavaScript o conteúdo e os links do WhatsApp aparecem normalmente; só o
menu do celular e a inclinação das cenas dependem dele. Nenhuma animação se repete sozinha: o que
se move responde ao ponteiro ou à rolagem (ou acontece uma vez, na entrada).

| Efeito | Objetivo | Mobile | Fallback |
| --- | --- | --- | --- |
| Painel do hero em camadas 3D (navegador, logo, celular e balão, `js/scene.js`) | Dar profundidade à marca na primeira dobra | Inclina ao arrastar na horizontal e ao rolar | Painel parado, com os traços já desenhados |
| Cenas dos projetos (captura + celular em perspectiva) | Dar noção de tela e de profundidade | Inclina ao rolar | Composição parada |
| Brilho no vidro e no fundo (`--gx`, `--mx`) | Mostrar o que está em foco | Só com mouse | Sem brilho |
| Entrada do hero (uma vez, ~1,2 s) | Guiar o olhar do título para a cena | Igual | Aparece pronto |
| Hero "do papel ao site": a captura real do Tio Pet se constrói sobre o desenho, de cima para baixo, conforme se rola | Mostrar a ideia virando site num só gesto | Igual, enquanto o painel sobe pela tela | Só o desenho (a captura fica oculta) |
| Entrada ao rolar (`data-reveal`) | Guiar a leitura | Igual | Conteúdo visível sem JS ou com movimento reduzido |
| Linha de "Como funciona" | Mostrar a ordem das etapas | Linha vertical | Linha já desenhada |
| Giroscópio 3D da seção "Sobre" (3 anéis em planos diferentes cruzando a logo) | Dar vida ao símbolo da marca | Os anéis giram ao rolar e inclinam com o dedo | Composição 3D parada |
| Entradas escalonadas dos projetos, títulos que se revelam, ícones que "saltam" (`css/motion.css`) | Guiar a leitura | Igual | Aparece pronto |
| Hero: flutuação (2 ciclos) e deriva em parallax ao rolar (`css/motion.css`) | Profundidade sem distrair | Só a deriva por rolagem | Estático. Com as cenas de rolagem ligadas, quem conduz o hero é a cena 1 |
| Entradas laterais e com zoom (`left`/`right`/`zoom` em `data-reveal`) | Narrativa de leitura por seção | Igual | Aparece pronto |
| Fio violeta que se desenha no topo de cada seção | Transição entre blocos | Igual | Linha estática |
| Cards de projeto/serviço: elevação, borda e brilho no hover/foco | Feedback e hierarquia | Só foco por teclado | Sem movimento |
| MDN Flow: tela real "Receitas e despesas" em camadas 3D (`assets/flow/`: a tela recortada e dois destaques tirados dela, menu Financeiro e totais) | Mostrar o produto de verdade | Mesma tela; no celular só o destaque do menu | Estático |
| Serviços: janelas ilustrativas em 3D com etiquetas numeradas que acendem junto com o serviço em foco | Explicar o que cada serviço entrega | Não aparecem (cada serviço acende ao passar pelo centro) | Lista em papel |
| Barra de progresso de leitura no header | Mostrar onde se está na página | Igual (navegadores com `animation-timeline`) | Sem barra |
| Anel que se expande no botão do contato (2 ciclos, ~4,8 s) | Chamar atenção sem distrair | Igual | Parado |
| Brilho que atravessa o botão principal | Feedback de interação | Só com mouse | Sem brilho |
| Numerais "01, 02, 03" de "Como funciona" contam a partir de 0 (uma vez) | Dar ritmo à entrada da seção | Igual | Numerais prontos |
| Porcentagem de leitura no header (só telas largas) | Mostrar onde se está na página | Não aparece | Não aparece |
| Faixa de luz que segue o mouse nos serviços | Feedback de foco | Só com mouse | Sem brilho |
| Hover de links e botões | Feedback de interação | Não existe em toque | Mudança de cor e borda |

O 3D é feito só com CSS (`perspective`, `preserve-3d`, `translate3d`) e um arquivo JS pequeno,
sem biblioteca; o JS só escreve variáveis CSS (`--rx`, `--ry`, `--px`, `--gx`, `--gy`, `--sp`).

**Cuidado ao mexer nas cenas:** elementos com `overflow`, `filter`, `opacity < 1` ou `contain`
"achatam" o 3D dos filhos. Entre `.hero-visual__world`, `.about__world` ou `.case__scene` e as camadas não coloque nenhum
desses. Para desligar o 3D, remova `js/scene.js` do `index.html` (as cenas ficam paradas).

## Cenas de rolagem (scrollytelling)

A página conta a história pela rolagem: o movimento acompanha a posição real do scroll, avança e
recua junto com ele e pára quando a rolagem pára. A rolagem em si nunca é capturada, travada ou
simulada (nada de `preventDefault` em `wheel`/`touch`, nada de "scroll jacking").

**Como funciona.** `js/scenes.js` (JavaScript puro, sem biblioteca) lê `window.scrollY`, calcula o
progresso de cada trilho `[data-scene]` e escreve variáveis CSS nele; toda a geometria (translate,
scale, rotate, 3D) está em `css/scenes/`, usando só `transform`/`translate`/`scale`/`rotate` e
`opacity`. Os valores avançam com uma inércia curta, e o laço pára sozinho quando convergem.

| Variável | Significado |
| --- | --- |
| `--e` | entrada: 0 a 1 enquanto o topo do trilho sobe do rodapé ao topo da tela |
| `--q` | história: 0 a 1, o avanço da cena (com o palco fixo, é a distância rolada com ele preso) |
| `--x` | saída: 0 a 1 (com `data-tail`, é a "cortina": a próxima seção sobe e cobre o palco) |
| `--st` | só com `data-stations="N"`: posição de 0 a N-1, com pausas (`data-hold`) em cada item |
| `--page` | na raiz: progresso do documento (barra do header) |

**Três modos**, definidos em `html[data-scenes]` (por um script no `<head>`, antes da primeira pintura):

- `pin`: telas largas (≥ 60em de largura e ≥ 36em de altura). Os trilhos `[data-pin]` ficam altos
  e o palco (`[data-pinbox]`) usa `position: sticky` durante a história.
- `lite`: celulares e telas baixas. Nada fica fixo; as mesmas cenas viram efeitos mais leves na
  rolagem normal (linha do processo vertical, serviços que acendem no centro, projetos em lista).
- sem o atributo: `prefers-reduced-motion: reduce`, navegador sem `svh`/`cqw`/`overflow: clip`/`translate`, sem JS ou se o motor falhar (o script do
  `<head>` remove `data-scenes` após 5 s sem resposta). A página fica estática, em fluxo normal, com
  todo o conteúdo e os links, e sem pinagem, sem parallax e sem animações.

| # | Cena | O que a rolagem faz (telas largas) | Celular (`lite`) |
| --- | --- | --- | --- |
| 1 | Hero | Palco fixo; o texto sobe um pouco e não some, o objeto 3D avança em profundidade e gira, a captura real do Tio Pet se constrói sobre o desenho, as camadas se separam, o quadriculado e o brilho evoluem; indicador de rolagem discreto | Mesmos movimentos com metade da intensidade, sem fixar |
| 2 | Projetos | Trilho horizontal (Trio Vilela, Tio Pet, Studio Monique Marques) conduzido pela rolagem vertical, com pausa em cada projeto, perspectiva e profundidade; a navegação inferior vira links para cada painel | Lista vertical (sem trilho) com imagem e texto em velocidades diferentes |
| 3 | Transições | A folha seguinte sobe cobrindo o palco: hero → projetos (cantos que se endireitam e luz violeta), projetos → serviços (a folha se deita em perspectiva), processo → MDN Flow (mudança de tom para índigo), Sobre → Contato (cúpula que se achata) | Rolagem normal |
| 4 | Serviços | Seção em papel: o serviço em foco acende (barra violeta) e a janela ilustrativa dele (wireframe genérico, não é projeto) vem à frente em 3D, com etiquetas numeradas | Cada serviço acende ao passar pelo centro |
| 5 | Como funciona | Linha horizontal em zigue-zague que se desenha com a rolagem; marcador com a logo na ponta; cada etapa liga quando a linha passa | Linha vertical que se desenha |
| 6 | MDN Flow | Tela real do sistema que vem de longe, avança ao primeiro plano e abre em profundidades diferentes (tela ao fundo, menu e totais à frente); texto e botão "Solicitar demonstração" ficam inteiros desde a chegada | Mesmo avanço, mais contido |
| 7 | Sobre | Anéis em planos diferentes giram com a rolagem, a "câmera" dá a volta e se aproxima, o brilho muda de lado e o texto acende na ordem de leitura | Anéis e câmera ligados à passagem pela tela |
| 8 | Encerramento | O Contato sobe e fica fixo; símbolo, celular e a conversa do hero e anéis convergem para o botão do WhatsApp, que acende no fim; título palavra por palavra | Os elementos saem de uma faixa abaixo do botão e entram nele |

As ilustrações são decorativas (`aria-hidden`) e não mostram métricas, telas ou funções inventadas.
O MDN Flow usa uma tela real (com `alt` descritivo e sem dados de clientes); os wireframes de serviços são esquemas genéricos.

**Ajustes comuns.**

- *Duração de uma cena fixa:* `height: calc(100svh * N)` do trilho, no arquivo da cena em
  `css/scenes/` (1 tela é o palco; o resto é rolagem de história; com `data-tail`, a última tela é a
  cortina da próxima seção).
- *Durações atuais (em alturas de tela, `100svh`):* hero 2,75 (1 palco + 0,75 de história + 1 de
  cortina), projetos 4,4 (1 + 2,4 + 1), serviços 3 (1 + 2), como funciona 3,1 (1 + 1,1 + 1), MDN
  Flow 2 (1 + 1), sobre 3,1 (1 + 1,1 + 1), contato 2 (1 + 1). Em 1440×900 a página tem ~16,8 telas.
  Se uma cena parecer "parada" ao rolar, encurte o trilho; se passar rápido demais, aumente.
- *Seção clara:* `data-tone="paper"` na `<section>` reatribui os tokens de cor (veja "Sistema
  visual"); evite `#fff`/`#000` fixos nos componentes dessa seção.
- *Pausa de cada projeto/serviço:* `data-hold` (0 a 0,45) no trilho; *quantidade de itens:* `data-stations`.
- *Quando o movimento começa/termina:* as fórmulas usam `--q`, `--e` e `--x`
  (ex.: `clamp(0, calc((var(--q) - 0.2) / 0.5), 1)` = "de 20% a 70% da história").
- *Última seção da página:* `data-q="end"` (+ `data-q-anchor="<seletor>"`) faz o progresso ir da
  chegada do elemento até um pouco acima do meio da tela (ou o fim do documento).
- *Telas baixas (notebook com barras do navegador, ~600 a 740 px de altura):* o conteúdo de cada
  palco precisa caber entre o header e o pé da tela. Por isso tamanhos e espaços dos palcos usam
  `svh` (`clamp(mín, n svh, máx)`, com o máximo igual ao layout original) e há faixas
  `@media (max-height: 46em)` / `(max-height: 40em)` (ex.: o "Como funciona" vira uma linha reta, o
  "Serviços" esconde a chamada). Ao criar ou mexer numa cena, confira de 576 a 1080 px de altura e de
  960 a 1920 de largura; abaixo de 36em de altura a página usa o modo `lite`.
- *Desligar tudo:* tire o script do `<head>` que define `data-scenes`, `js/scenes.js` e os links de
  `css/scenes/`; a página volta ao layout estático.

**Cuidado:** o palco fixo usa `overflow: clip`. O que sair do palco (ex.: blocos que crescem com a
rolagem) é cortado; em `lite`, quem pode estourar a largura precisa de `overflow: clip` no pai
(foi o caso do quadriculado do hero).

## Como conferir uma mudança

O repositório não tem lint, verificação de tipos nem build; a conferência é manual:

1. `python3 -m http.server 8000` nesta pasta e abra `http://localhost:8000/`.
2. Percorra a página de cima a baixo, depois de baixo para cima, parando no meio das animações e
   rolando devagar e rápido: nada pode ficar sumido, cortado ou sobreposto.
3. Teste de 960×576 a 1920×1080 (modo `pin`) e em celular (~390×844, modo `lite`): sem rolagem
   horizontal e com o texto de cada palco cabendo entre o header e o pé da tela.
4. Ligue "Reduzir movimento" no sistema (a página vira estática) e desligue o JavaScript (todo o
   conteúdo e os links continuam lá).
5. Navegue só pelo teclado (Tab/Shift+Tab: foco sempre visível, inclusive nos links "Visitar site" e
   no botão do MDN Flow), use os links do menu, o botão Voltar do navegador e links com `#`
   (ex.: `/#tio-pet`).
