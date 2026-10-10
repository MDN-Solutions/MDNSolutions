# MDN Solutions — site estático

Abra `index.html` direto no navegador. Não precisa de build nem de servidor.

```
index.html                 Conteúdo da página (seções marcadas com <!-- ===== NOME ===== -->)
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
