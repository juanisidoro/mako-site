---
title: "Como Criar um llms.txt que Agentes de IA Realmente Usam"
description: "Guia rápido para criar um arquivo llms.txt eficaz — o robots.txt dos agentes de IA. Diga ao ChatGPT, Claude e Perplexity do que se trata o seu site."
---

# Como Criar um llms.txt que Agentes de IA Realmente Usam

O arquivo `llms.txt` é a forma mais simples de dizer aos agentes de IA sobre o que é o seu site. Pense nele como o `robots.txt` dos LLMs — um arquivo de texto puro na raiz do seu site que descreve o seu conteúdo, estrutura e capacidades para consumo por IA.

Se um agente não sabe o que o seu site oferece, ele não pode recomendá-lo. Configurar isso leva 5 minutos.

## O que é o llms.txt?

O [padrão llms.txt](https://llmstxt.org) define um arquivo de texto servido em `https://seusite.com/llms.txt` que fornece aos agentes de IA:

- Uma descrição do seu site e negócio
- Páginas principais e seus propósitos
- Estrutura do conteúdo e dicas de navegação
- Endpoints de API ou capacidades especiais
- O que o agente deve e não deve fazer

Não é uma especificação técnica — é uma conversa com o agente em linguagem natural.

## Estrutura Básica

Um `llms.txt` mínimo que funciona:

```markdown
# Nome do Seu Site

> Descrição breve do seu site (1-2 frases).

## Páginas Principais

- [Início](https://seusite.com): O que os visitantes encontram aqui
- [Produtos](https://seusite.com/produtos): Seu catálogo de produtos
- [Blog](https://seusite.com/blog): Artigos sobre o seu setor
- [Contato](https://seusite.com/contato): Como entrar em contato

## O que Este Site Oferece

Descreva sua proposta de valor em 2-3 frases.
O que torna o seu site relevante para alguém que pergunte a uma IA sobre o seu tema?
```

## Exemplo Real

O `llms.txt` do [makospec.vercel.app](https://makospec.vercel.app/llms.txt):

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> Protocolo aberto para servir conteúdo web otimizado para LLMs.
> Reduz o consumo de tokens em ~93% via negociação de conteúdo.

## Documentação

- [Especificação](https://makospec.vercel.app/pt/docs/spec): Spec completa do protocolo MAKO
- [Formato CEF](https://makospec.vercel.app/pt/docs/cef): Compact Embedding Format
- [Cabeçalhos HTTP](https://makospec.vercel.app/pt/docs/headers): Referência de headers
- [Exemplos](https://makospec.vercel.app/pt/docs/examples): Produto, artigo, docs

## Ferramentas

- [Analisador](https://makospec.vercel.app/pt/analyzer): Gere MAKO de qualquer URL
- [Score](https://makospec.vercel.app/pt/score): Auditoria de prontidão para IA (0-100)
- [Diretório](https://makospec.vercel.app/pt/directory): Análises públicas

## Pacotes

- npm: @mako-spec/js (SDK TypeScript)
- npm: @mako-spec/cli (Ferramenta CLI)
- WordPress: plugin mako-wp
```

## Dicas para um llms.txt Eficaz

### Seja específico, não genérico

Ruim: "Vendemos coisas online."
Bom: "Plataforma SaaS B2B para gestão de inventário. Mais de 2.000 SKUs em eletrônicos, móveis e material de escritório."

### Inclua suas URLs principais

Os agentes usam-nas para navegar pelo seu site. Liste as 5-10 páginas mais importantes.

### Mencione suas capacidades

Se o seu site tem API, busca ou funcionalidades especiais, diga:

```markdown
## API

- POST /api/search: Buscar produtos por consulta
- GET /api/products/:id: Obter detalhes do produto em JSON
```

### Atualize quando seu site mudar

Um `llms.txt` desatualizado é pior do que não ter nenhum. Se você adicionar uma nova seção, categoria de produto ou funcionalidade, atualize o arquivo.

### Mantenha abaixo de 500 linhas

É um resumo, não o seu sitemap completo. Agentes têm limites de contexto.

## Onde Colocá-lo

O arquivo deve ser servido na raiz do seu domínio:

```
https://seusite.com/llms.txt
```

**Sites estáticos (HTML, Hugo, Astro):** Adicione `llms.txt` à sua pasta `public/` ou `static/`.

**Next.js:** Crie `public/llms.txt` ou adicione um route handler em `app/llms.txt/route.ts`.

**WordPress:** Use um plugin, adicione à raiz do seu tema, ou crie uma regra de reescrita.

**Nginx/Apache:** Coloque o arquivo no diretório raiz do servidor web.

## llms.txt vs MAKO

Esses dois padrões se complementam:

| | llms.txt | MAKO |
|---|---|---|
| **Escopo** | Nível de site | Nível de página |
| **Propósito** | Descrever o que seu site oferece | Servir conteúdo otimizado por página |
| **Formato** | Texto puro / markdown | Frontmatter YAML + corpo markdown |
| **Ideal para** | Descoberta e navegação | Consumo de conteúdo e ações |

Use `llms.txt` para que os agentes encontrem seu conteúdo. Use [MAKO](https://makospec.vercel.app/pt/docs) para servi-lo de forma eficiente.

## Verifique se Funciona

Após criar seu `llms.txt`:

1. Acesse `https://seusite.com/llms.txt` no seu navegador — deve aparecer como texto puro
2. Passe seu site pelo [MAKO Score](https://makospec.vercel.app/pt/score) — o check "Has llms.txt" deve ser aprovado
3. Pergunte ao ChatGPT ou Claude: "O que [seusite.com] oferece?" — se o `llms.txt` estiver indexado, a resposta melhora

Cinco minutos de trabalho. Visibilidade permanente para cada agente de IA que visitar seu site.
