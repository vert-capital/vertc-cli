<h1 align="center" id="title">🚀 VERT CLI</h1>

<p align="center" id="description">
  <strong>Linha de comando da VERT Capital para criação de novos projetos baseados em templates</strong>
</p>

<p align="center">
  <a href="https://github.com/vert-capital/vertc-cli">
    <img src="https://img.shields.io/github/stars/vert-capital/vertc-cli?style=social" alt="GitHub stars">
  </a>
  <a href="https://www.npmjs.com/package/vert-cli">
    <img src="https://img.shields.io/npm/v/vert-cli" alt="npm version">
  </a>
</p>

---

## 📋 Índice

- [🚀 Início Rápido](#-início-rápido)
- [💻 Templates Disponíveis](#-templates-disponíveis)
- [🛠️ Geradores de Código](#️-geradores-de-código)
- [⚙️ Formas de Utilização](#️-formas-de-utilização)
- [📗 Design System VERT](#-design-system-vert)

---

## 🚀 Início Rápido

A forma mais rápida de começar é usar diretamente do GitHub (sempre a versão mais atualizada):

```bash
# Listar todas as opções disponíveis
npx github:vert-capital/vertc-cli --options

# Criar um projeto Remix
npx github:vert-capital/vertc-cli --template remix

# Gerar código CRUD para Remix
npx github:vert-capital/vertc-cli --generate remix-crud
```

<h2>⚙️ Configuração</h2>

### Usando o pacote NPM

Criação de um novo projeto:
<pre>
<code>npx vert-cli@latest --template remix</code>
</pre>

Gerador de código:

<pre>
<code>npx vert-cli@latest --generate remix-crud</code>
</pre>

OU para listar todas opções disponíveis:

<pre>
<code>npx vert-cli@latest --options</code>
</pre>

### Usando diretamente do repositório GitHub

Você também pode usar a CLI diretamente do repositório remoto:

Criação de um novo projeto:
<pre>
<code>npx github:vert-capital/vertc-cli --template remix</code>
</pre>

Gerador de código:
<pre>
<code>npx github:vert-capital/vertc-cli --generate remix-crud</code>
</pre>

Para listar todas opções disponíveis:
<pre>
<code>npx github:vert-capital/vertc-cli --options</code>
</pre>

## 💻 Templates Disponíveis

### 🌐 Remix (Frontend SSR)
Aplicação SSR completa com autenticação, utilizando Remix, Vite, TailwindCSS, Common e Design System da VERT.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --template remix
```

**Tecnologias:** [Remix](https://remix.run/) • [Vite](https://vitejs.dev/) • [TailwindCSS](https://tailwindcss.com/) • [@vert-capital/common](https://www.npmjs.com/package/@vert-capital/common) • [@vert-capital/design-system-ui](https://www.npmjs.com/package/@vert-capital/design-system-ui)

---

### 🔧 Go API (Backend)
Template de API em Go com arquitetura limpa baseada em DDD e autenticação SSO.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --template go-api
```

**Características:** Arquitetura Limpa • DDD • Autenticação SSO • Clean Architecture

---

### 📊 Golang CRUD
Template especializado para criação de CRUD em Go com arquitetura limpa.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --template golang-crud
```

**Características:** CRUD Completo • Clean Architecture • Go Best Practices

---

### 🔄 Jenkins Pipeline
Template para configuração de pipelines Jenkins com suporte a diferentes tipos de projeto.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --template jenkins
```

**Suporte para:** Remix • Golang • Django

---

### ☸️ Kubernetes
Template para configuração de recursos Kubernetes com diferentes ambientes e tipos de projeto.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --template kubernetes
```

**Ambientes:** Produção (prd) • Staging (stg) • Homologação (hml)
**Projetos:** Remix • Golang • Django

## 🛠️ Geradores de Código

### 📝 Remix CRUD
Gerador automático de código CRUD para projetos Remix.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --generate remix-crud
```

---

### 🔐 Remix Login
Gerador de sistema de autenticação completo para projetos Remix.

**Uso direto do GitHub:**
```bash
npx github:vert-capital/vertc-cli --generate remix-login
```

---

## ⚙️ Formas de Utilização

### 🌟 Recomendado: GitHub Direto
Use diretamente do repositório para sempre ter a versão mais atualizada:

```bash
# Listar opções
npx github:vert-capital/vertc-cli --options

# Criar projeto
npx github:vert-capital/vertc-cli --template [nome-do-template]

# Gerar código
npx github:vert-capital/vertc-cli --generate [nome-do-gerador]
```

### 📦 Via NPM
```bash
# Instalar globalmente
npm install -g vert-cli

# Ou usar diretamente
npx vert-cli@latest --template remix
npx vert-cli@latest --generate remix-crud
npx vert-cli@latest --options
```

### 🔧 Desenvolvimento Local
```bash
git clone https://github.com/vert-capital/vertc-cli.git
cd vertc-cli
npm install
node index.js --template remix
```

---

## 📗 Design System VERT

O [Design System VERT](https://doc.design-system.vert-capital.app) está em construção, portanto alguns componentes podem estar faltando ou com problemas.

**Alternativas recomendadas:**
- 📚 [shadcn/ui](https://ui.shadcn.com/) - Para componentes base
- 🎨 Código fonte de outros projetos da VERT
- 📖 [Documentação oficial](https://doc.design-system.vert-capital.app)

---

<div align="center">
  <p>Feito com ❤️ pela equipe <strong>VERT Capital</strong></p>

  <a href="https://github.com/vert-capital/vertc-cli/issues">🐛 Reportar Bug</a> •
  <a href="https://github.com/vert-capital/vertc-cli/discussions">💬 Discussões</a> •
  <a href="https://github.com/vert-capital/vertc-cli">⭐ GitHub</a>
</div>
