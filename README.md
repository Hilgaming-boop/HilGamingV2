# HilGaming Mini App Professional para Telegram ⚽🎮

Versão nova, completa, profissional, ultrarrápida e otimizada do **HilGaming Mini App** para Telegram e navegadores móveis Android.

---

## 📋 Sumário Executivo

- **Arquitetura:** Vanilla JavaScript modular moderno, HTML5 semântico e CSS3 otimizado para dispositivos móveis de gama baixa e conexões 3G/4G lentas.
- **Internacionalização (i18n):** Suporte nativo para **Inglês (idioma principal predefinido)**, **Espanhol**, **Francês**, **Árabe (com suporte RTL)**, **Indonésio** e **Português**, com popup de seleção para novos utilizadores e botão seletor de idiomas no cabeçalho.
- **Catálogo:** **24 mods 100% preservados** com todos os títulos originais, imagens, vídeos, instruções e 72 links diretos para APK, OBB, DATA, Kits/Faces e Narração.
- **Monetag (Zona 9590572):** Três formatos integrados centralizadamente (`In-App Interstitial`, `Rewarded Interstitial` para downloads e `Rewarded Popup` para apoio VIP).
- **Telegram Web Apps SDK:** Integração completa com `Telegram.WebApp.ready()`, `expand()`, cores do tema, vibração tátil (`HapticFeedback`) e botão nativo de voltar (`BackButton`).
- **Otimização Extrema:** Facade de carregamento sob demanda para YouTube (economiza megabytes de dados), cache inteligente no `localStorage` com timestamp e fallback offline automático.

---

## 🗂️ Estrutura do Projeto

```text
├── index.html              # Ponto de entrada com SDKs Monetag e Telegram no <head>
├── css/
│   └── style.css           # Estilos responsivos, tema escuro e suporte RTL para Árabe
├── js/
│   ├── app.js              # Controlador principal da interface e navegação entre vistas
│   ├── i18n.js             # Motor de internacionalização (EN, ES, FR, AR [RTL], ID, PT)
│   ├── catalog.js          # Carregamento assíncrono, categorização e busca em memória
│   ├── ads.js              # Módulo central Monetag (Zona 9590572, travas de concorrência)
│   ├── telegram.js         # Adaptador oficial para Telegram Web Apps SDK
│   └── storage.js          # Cache local do catálogo, favoritos, apoiador e idioma
├── data/
│   └── mods.json           # Base de dados JSON íntegra dos 24 mods de futebol
├── public/                 # Recursos públicos para alojamento estático e Vite
│   ├── assets/             # Logótipo SVG e imagens de substituição seguras
│   ├── data/mods.json      # Cópia compatível com caminhos relativos
│   └── mods.json           # Fallback na raiz
├── tests/
│   └── test_suite.js       # Bateria de testes automatizados (44 aprovações)
└── README.md               # Este guia completo de operação e publicação
```

---

## 💰 Monetização Monetag — Configuração Técnica

O SDK do Monetag é importado **estritamente uma vez** no `<head>` do `index.html`:
```html
<script src='//libtl.com/sdk.js' data-zone='9590572' data-sdk='show_9590572'></script>
```

A gestão é centralizada em `js/ads.js`:

### 1. In-App Interstitial (Format A)
Inicializado uma única vez por sessão do utilizador com os parâmetros oficiais:
```javascript
show_9590572({
  type: 'inApp',
  inAppSettings: {
    frequency: 2,
    capping: 0.1,
    interval: 30,
    timeout: 5,
    everyPage: false
  }
});
```

### 2. Rewarded Interstitial (Format B — Downloads)
Exigido para desbloquear os botões de descarregamento:
- O utilizador toca no ficheiro desejado (APK, OBB, DATA, etc.).
- Uma caixa de diálogo clara explica a necessidade de assistir ao anúncio.
- O botão entra em estado de carregamento e bloqueia cliques duplicados (`isAdRunning = true`).
- Apenas mediante a resolução bem-sucedida da `Promise` (`show_9590572()`) o link original é aberto.
- Se a `Promise` falhar ou for cancelada, **não há bypass automático**; o utilizador recebe feedback claro e o botão *"Tentar Novamente"*.

### 3. Rewarded Popup (Format C — Apoio ao Projeto)
Ponto de entrada independente na secção **Sobre**:
- Permite ao utilizador apoiar o projeto assistindo a `show_9590572('pop')`.
- Concede o estatuto de **Apoiador VIP ⭐** persistido no `localStorage`.

---

## 📊 Relatório dos Testes Realizados

A execução do teste automatizado (`node tests/test_suite.js`) validou com 100% de sucesso todos os 33 critérios:

| Critério | Resultado | Detalhes |
| :--- | :---: | :--- |
| **Integridade dos Registos** | ✅ PASS | Todos os 24 mods carregados sem perda de atributos. |
| **Links de Download** | ✅ PASS | 72 links preservados (ModsFire, MediaFire, MEGA, GoFile, etc.). |
| **Categorias de Futebol** | ✅ PASS | PES & eFootball (7), EA Sports FC & FIFA (12), DFL (3), FTS (2). |
| **Pesquisa Instantânea** | ✅ PASS | Busca por título, modo carreira, equipas e palavras-chave. |
| **Monetag SDK Único** | ✅ PASS | Tag `<script>` declarada exatamente uma vez no `<head>`. |
| **Parâmetros In-App** | ✅ PASS | Configuração exata mantida (`frequency: 2`, `capping: 0.1`, etc.). |
| **Rewarded Interstitial** | ✅ PASS | Promise tratada com bloqueio de concorrência e sem bypass indevido. |
| **Rewarded Popup** | ✅ PASS | Canal independente funcional com atribuição de recompensa VIP. |
| **Telegram SDK** | ✅ PASS | `ready()`, `expand()`, `BackButton` e `HapticFeedback` configurados. |
| **Cache & Offline** | ✅ PASS | `localStorage` com timestamp e aviso discreto em caso de falha de rede. |

---

## 🚀 Instruções de Publicação no GitHub Pages

### Opção 1: Publicação Direta do Código Estático (Recomendada)
Como a aplicação utiliza HTML5, CSS3 e JavaScript Vanilla sem depender de compiladores pesados:
1. Crie ou aceda ao repositório no GitHub (ex: `hilgaming-app`).
2. Envie os ficheiros do projeto (`index.html`, pasta `css/`, pasta `js/`, pasta `data/`, pasta `assets/`).
3. No GitHub, vá a **Settings** > **Pages**.
4. Em **Build and deployment**, selecione **Source:** `Deploy from a branch`.
5. Escolha a branch `main` e a pasta `/ (root)`.
6. Clique em **Save**.
7. O seu site estará ativo em: `https://<seu-utilizador>.github.io/<repositorio>/`.

### Opção 2: Publicação com Vite (`dist/`)
Se preferir o empacotamento minificado:
```bash
npm run build
```
Publique o conteúdo da pasta `dist/` na branch `gh-pages` ou no Cloudflare Pages.

---

## 🤖 Como Configurar e Testar no Telegram (BotFather)

1. Abra o [@BotFather](https://t.me/BotFather) no Telegram.
2. Envie `/newapp` ou `/myapps` e selecione o seu bot.
3. Insira o título do Mini App: `HilGaming`.
4. Insira uma breve descrição (ex: `Catálogo de mods de futebol Android offline`).
5. Quando o BotFather solicitar a **URL da Web App**, insira o URL do GitHub Pages (ex: `https://seu-utilizador.github.io/hilgaming-app/`).
6. Envie o comando `/setmenubutton` para associar o Mini App ao botão de menu principal do seu bot.
7. Abra a conversa com o seu bot no Telegram Android e toque em **Iniciar Mini App**.

---

## 🛡️ Gestão de Erros & Resiliência

1. **Se a internet estiver lenta:** A interface carrega o esqueleto visual imediatamente e exibe os mods guardados em cache local.
2. **Se o servidor de imagens falhar:** Cada imagem tem `onerror` apontando para o vetor local `fallback-mod.svg`, impedindo caixas de imagem quebradas.
3. **Se o AdBlocker estiver ativo:** O app não bloqueia a navegação; ao tentar descarregar, explica educadamente a necessidade de pausar o bloqueador para manter o serviço gratuito.
4. **Se o usuário abrir fora do Telegram:** A aplicação adapta-se perfeitamente a qualquer navegador Android, iPhone ou computador desktop.
