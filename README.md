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
  sections/                Um arquivo por seção: hero, projects, strip, services, process, about, contact
  motion.css               Movimento extra (entradas escalonadas, micro-interações, barra de progresso)
js/main.js                 Header, menu, link ativo, entrada ao rolar, ano no rodapé
js/scene.js                Inclinação 3D das cenas e brilho que segue o mouse
js/extras.js               Faixa de projetos (pausa), numerais que contam e % de leitura
assets/                    Fontes, logo, ícones e capturas dos projetos (assets/projects/)
```

## Como editar

- **Textos e links:** em `index.html`. Os links do WhatsApp seguem o formato
  `https://wa.me/5581998576040?text=<mensagem codificada>`.
- **Cores e espaçamentos globais:** variáveis no topo de `css/base.css` (ex.: `--c-violet`).
- **Estilo de uma seção:** arquivo com o nome dela em `css/sections/`.
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
- **Link para o site no ar:** ainda não há links porque os endereços de produção dos clientes não
  foram confirmados. Quando houver, acrescente dentro de `.case__body`, depois da ficha:
  `<a class="product__link" href="https://…" target="_blank" rel="noopener noreferrer">Ver o site <svg class="icon" width="16" height="16" aria-hidden="true"><use href="#icon-arrow-up-right" /></svg><span class="visually-hidden">(abre em nova aba)</span></a>`
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

| Item | Valor | Uso |
| --- | --- | --- |
| `--c-ink` | `#000` | Fundo da página |
| `--c-graphite`, `--c-graphite-2` | `#101010`, `#161616` | Cards e painéis |
| `--c-line`, `--c-line-strong` | `#242424`, `#3b3b3b` | Divisores e bordas |
| `--c-pencil` | `#8f8f8f` | Texto secundário (6,5:1 sobre o fundo) |
| `--c-chalk` | `#c4c4c4` | Texto corrido (12:1 sobre o fundo) |
| `--c-paper`, `--c-white` | `#f3f3f3`, `#fff` | Títulos e botão principal |
| `--c-violet` | `139 108 255` | Acento da marca: brilhos e destaques, nunca como cor de texto |
| `--grid-line` | branco a 5,5% | Quadriculado dos fundos |

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
| Entrada ao rolar (`data-reveal`) | Guiar a leitura | Igual | Conteúdo visível sem JS ou com movimento reduzido |
| Linha de "Como funciona" | Mostrar a ordem das etapas | Linha vertical | Linha já desenhada |
| Giroscópio 3D da seção "Sobre" (3 anéis em planos diferentes cruzando a logo) | Dar vida ao símbolo da marca | Os anéis giram ao rolar e inclinam com o dedo | Composição 3D parada |
| Entradas escalonadas dos projetos, títulos que se revelam, ícones que "saltam" (`css/motion.css`) | Guiar a leitura | Igual | Aparece pronto |
| Barra de progresso de leitura no header | Mostrar onde se está na página | Igual (navegadores com `animation-timeline`) | Sem barra |
| Anel que se expande no botão do contato (2 ciclos, ~4,8 s) | Chamar atenção sem distrair | Igual | Parado |
| Brilho que atravessa o botão principal | Feedback de interação | Só com mouse | Sem brilho |
| Faixa de projetos que rola sozinha (`css/sections/strip.css`, `js/extras.js`) | Mostrar os trabalhos logo no começo de "Projetos" | Igual | Lista rolável com o dedo/mouse, sem animação |
| Faixa: pausa no hover, no foco do teclado e pelo botão "Pausar faixa" | Cumprir WCAG 2.2.2 (movimento de mais de 5 s precisa poder parar) | Botão de pausa | Botão some (não há movimento) |
| Numerais "01, 02, 03" de "Como funciona" contam a partir de 0 (uma vez) | Dar ritmo à entrada da seção | Igual | Numerais prontos |
| Porcentagem de leitura no header (só telas largas) | Mostrar onde se está na página | Não aparece | Não aparece |
| Faixa de luz que segue o mouse nos serviços e nos cartões da faixa | Feedback de foco | Só com mouse | Sem brilho |
| Hover de links e botões | Feedback de interação | Não existe em toque | Mudança de cor e borda |

O 3D é feito só com CSS (`perspective`, `preserve-3d`, `translate3d`) e um arquivo JS pequeno,
sem biblioteca; o JS só escreve variáveis CSS (`--rx`, `--ry`, `--px`, `--py`, `--sp`, `--spread`).

**Cuidado ao mexer nas cenas:** elementos com `overflow`, `filter`, `opacity < 1` ou `contain`
"achatam" o 3D dos filhos. Entre `.hero-visual__world`, `.about__world` ou `.case__scene` e as camadas não coloque nenhum
desses. Para desligar o 3D, remova `js/scene.js` do `index.html` (as cenas ficam paradas).
