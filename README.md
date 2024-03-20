<h1 align="center" id="title">VERT CLI</h1>

<p id="description">Linha de comando da VERT Capital para criação de novos projetos baseados em templates.</p>

<h2>⚙️ Configuração</h2>
Criação de um novo projeto:
<pre>
<code>npx vert-cli@latest --template remix</code>
</pre>

Gerador de código:

<pre>
<code>npx vert-cli@latest --generate remix-crud</code>
</pre>

OU

<pre>
<code>npx vert-cli@latest --generate-list</code>
</pre>

<h2>💻 Templates</h2>

Templates disponíveis:

- remix: Aplicação SSR com autenticação, utilizando <a href="https://remix.run/">Remix</a>, <a href="https://vitejs.dev/">Vite</a>, <a href="https://tailwindcss.com/docs/installation">TailwindCSS</a>. Também <a href="https://www.npmjs.com/package/@vert-capital/common">Common</a> e <a href="https://www.npmjs.com/package/@vert-capital/design-system-ui">Design System</a> da VERT.

- go (em breve): API feita em go com arquitetura limpa baseada em DDD. Possui autenticação com SSO.

<h2>⚠️ ATENÇÃO</h2>

O <a href="https://www.npmjs.com/package/@vert-capital/design-system-ui">Design System VERT</a> está em construção, portanto ainda não existe uma documentação.

Utilize a documentação do <a href="https://ui.shadcn.com/">shadcn/ui</a> para se basear em componentes comuns, e também no código fonte de outros projetos da VERT.
