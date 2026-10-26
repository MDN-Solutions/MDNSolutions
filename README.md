# MDN Solutions — site estático

Abra `index.html` direto no navegador. Não precisa de build nem de servidor.

```
index.html                 Conteúdo da página (seções marcadas com <!-- ===== NOME ===== -->)
robots.txt                 Libera a indexação e aponta para o sitemap
sitemap.xml                Páginas do site para o Google (hoje, só a página inicial)
og-image.png               Imagem que aparece ao compartilhar o link (1200×630)
css/
  base.css                 Fontes, variáveis (cores, tamanhos, espaçamentos), reset e utilitários
  components.css           Botões, logo e botão flutuante do WhatsApp
  header.css               Header fixo e menu mobile
  footer.css               Rodapé
  sections/                Um arquivo por seção: hero, services, benefits, steps, about, contact
js/main.js                 Interações (header, menu, animações, botão do WhatsApp, ano)
assets/                    Fontes, logo e ícones do site
```

## Como editar

- **Textos e links:** em `index.html`. Os links do WhatsApp seguem o formato
  `https://wa.me/5581998576040?text=<mensagem codificada>`.
- **Cores e espaçamentos globais:** variáveis no topo de `css/base.css` (ex.: `--c-violet`).
- **Estilo de uma seção:** arquivo com o nome dela em `css/sections/`.
  As classes seguem o padrão `bloco__elemento--modificador` (ex.: `.benefits__item`).
- **Classes compartilhadas** (em `base.css`): `.section` (espaço do topo), `.section-title`,
  `.lead` (parágrafo de destaque), `.location` (linha com ícone de local) e `.icon`.
- **Ícones:** ficam num sprite no início do `<body>`. Para usar:
  `<svg class="icon" width="20" height="20" aria-hidden="true"><use href="#icon-whatsapp" /></svg>`
- **Animação de entrada:** adicione `data-reveal="up"` a qualquer elemento.
- **Animação do hero:** cada traço tem `style="--delay: …; --duration: …"` (duração padrão 0.8s).
- **Alvo de toque:** links e botões usam `min-height: var(--tap)` (44px). Mantenha em novos links.

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

| Item | Valor | Uso |
| --- | --- | --- |
| `--c-ink` | `#000` | Fundo da página |
| `--c-graphite`, `--c-graphite-2` | `#101010`, `#161616` | Cards e painéis |
| `--c-line`, `--c-line-strong` | `#242424`, `#3b3b3b` | Divisores e bordas |
| `--c-pencil` | `#8f8f8f` | Texto secundário (6,5:1 sobre o fundo) |
| `--c-chalk` | `#c4c4c4` | Texto corrido (12:1 sobre o fundo) |
| `--c-paper`, `--c-white` | `#f3f3f3`, `#fff` | Títulos e botão principal |
| `--c-violet` | `139 108 255` | Acento da marca: brilhos e destaques, nunca como cor de texto |

- **Tipografia:** Bricolage Grotesque (variável, pesos 200–800), escala fluida com `clamp()`
  (`--fs-*`). O mascote da logo nunca muda de cor.
- **Formas:** raios `--r-sm` 12px, `--r-md` 20px, `--r-lg` 32px e `--r-pill`.
- **Espaço:** `--space-section` entre seções; container de `75rem`.

## Movimento

Todo movimento fica desligado com `prefers-reduced-motion: reduce` (o conteúdo aparece pronto). Sem
JavaScript o conteúdo e os links do WhatsApp aparecem normalmente; só o menu do celular e o botão
flutuante dependem dele.

| Animação | Objetivo | Mobile | Fallback |
| --- | --- | --- | --- |
| Desenho do hero (traços, logo e balão, cerca de 2,5 s) | Explicar "site + celular + WhatsApp" | Igual ao desktop; pausa fora da tela | Ilustração estática completa |
| Flutuação do celular e do balão (2 ciclos, 4–5 px) | Dar vida ao hero sem distrair | Igual; pausa fora da tela | Para sozinha; parada com movimento reduzido |
| Entrada ao rolar (`data-reveal`) | Guiar a leitura, com deslocamento curto | Igual | Conteúdo visível sem JS ou com movimento reduzido |
| Inclinação 3D do hero (`js/effects.js` + `css/effects.css`) | Dar profundidade à ilustração; camadas se afastam conforme o ponteiro | Com o dedo no hero e leve inclinação ao rolar | Painel parado, com luz e sombra |
| Cards com inclinação 3D e brilho | Mostrar qual card está em foco | Não existe em toque (só mouse) | Card estático, com borda e sombra |
| Planeta e anéis da seção "Sobre" | Dar vida ao símbolo da marca | Anéis giram ao rolar (navegadores com `animation-timeline`) | Anéis parados |
| Hover dos cards | Feedback de interação | Não existe em toque (só `hover: hover`) | Borda e cor mudam, sem deslocamento |
| Menu mobile e ícone do botão | Confirmar abrir e fechar | Só aparece em telas pequenas | Troca imediata |
| Linha do tempo "Como funciona" | Mostrar a ordem das etapas | Linha vertical | Linha já desenhada |

O 3D é feito só com CSS (`perspective`, `rotateX/Y`) e um arquivo JS de cerca de 130 linhas, sem
biblioteca. Os efeitos ficam em `css/effects.css` e `js/effects.js`: para desligar tudo, remova
esses dois arquivos do `index.html`.
