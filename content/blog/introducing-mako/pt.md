---
title: "Apresentando o MAKO: O Protocolo Aberto para Conteudo Otimizado para IA"
description: "Por que criamos o MAKO e como ele reduz o consumo de tokens em 94%, tornando qualquer pagina web compreensivel para agentes de IA."
---

# Apresentando o MAKO

A web nao foi projetada para agentes de IA. Toda vez que o ChatGPT, o Perplexity ou um assistente de compras visita um site, ele baixa barras de navegacao, banners de cookies, scripts de anuncios e milhares de linhas de markup — apenas para encontrar o nome e o preco de um produto.

O resultado? **Mais de 4.000 tokens consumidos** antes de o agente chegar ao conteudo real. Para SPAs renderizadas com JavaScript, a situacao e ainda pior: o agente ve um `<div id="root"></div>` vazio e nada mais.

## O Problema

Considere uma pagina tipica de produto em um e-commerce. Um visitante humano ve um layout limpo com imagem do produto, titulo, preco e um botao "Adicionar ao carrinho". Um agente de IA ve isto:

- 181 KB de HTML bruto
- Navegacao com 47 links
- 3 scripts de consentimento de cookies
- CSS inline para mais de 200 componentes
- Os dados reais do produto enterrados em algum lugar no meio

Isso e **93% ruido, 7% sinal**.

## O Buraco Negro das SPAs

Para aplicacoes JavaScript modernas (React, Vue, Angular, Next.js CSR), a situacao e ainda pior. Quando um agente de IA solicita uma pagina, o servidor responde com algo assim:

```html
<div id="root"></div>
<script src="/bundle.js"></script>
```

O conteudo real — produtos, artigos, precos, descricoes — e renderizado no lado do cliente por JavaScript. Agentes de IA nao executam JavaScript. Eles veem uma pagina vazia. Todo o seu site e **invisivel**.

A renderizacao no servidor (SSR) e a geracao estatica ajudam, mas mesmo assim o HTML vem inchado com marcadores de hidratacao, estado embutido e artefatos do framework. Uma pagina Next.js com SSR ainda envia de 5 a 10 vezes mais tokens do que o necessario, porque inclui a arvore React completa junto com o conteudo real.

A web esta dividida: sites legados enviam ruido demais, SPAs modernas nao enviam nada. Nenhum dos formatos foi projetado para o publico que mais cresce.

## O Que o MAKO Faz

O MAKO adiciona uma camada estruturada e otimizada para IA a qualquer site usando negociacao de conteudo HTTP padrao. Quando um agente de IA envia `Accept: text/mako+markdown`, o servidor responde com um documento MAKO limpo em vez de HTML bruto:

```yaml
---
mako: "1.0"
type: product
entity: "Fones de Ouvido Sem Fio Pro"
tokens: 276
language: pt
updated: "2026-02-20T10:00:00Z"
---
```

A mesma URL, o mesmo servidor — apenas uma resposta diferente para um publico diferente.

## Decisoes de Design Fundamentais

**Negociacao de conteudo em vez de novos endpoints.** Escolhemos o padrao do header `Accept` porque nao exige nenhuma alteracao de URL. Qualquer pagina existente pode servir MAKO sem criar rotas duplicadas.

**Markdown em vez de JSON.** Os LLMs sao treinados com markdown. Um documento markdown bem estruturado com frontmatter YAML e mais eficiente em tokens e mais naturalmente legivel por modelos de linguagem do que o JSON equivalente.

**10 tipos de conteudo.** Produto, artigo, documentacao, landing, listagem, perfil, evento, receita, FAQ e personalizado. Cada tipo indica ao agente exatamente qual estrutura esperar.

**Acoes declaradas.** Em vez de esperar que o agente encontre o botao "Adicionar ao carrinho" no HTML, o MAKO declara acoes legiveis por maquina com endpoints e parametros.

## Os Numeros

Nos nossos benchmarks com mais de 50 paginas reais:

| Metrica | HTML Bruto | MAKO |
|---------|------------|------|
| Tamanho medio | 181 KB | 3 KB |
| Tokens medio | ~4.125 | ~276 |
| Reducao | — | **93%** |

Nao e uma melhoria marginal. E a diferenca entre um agente que consegue processar 3 paginas por janela de contexto e um que consegue processar 45.

## Como Comecar

O MAKO esta disponivel hoje:

- **WordPress:** Instale o [plugin mako-wp](https://github.com/juanisidoro/mako-wp) — ative e funciona com WooCommerce, Yoast e ACF
- **Qualquer stack:** Use [@mako-spec/js](https://www.npmjs.com/package/@mako-spec/js) — SDK TypeScript com middleware Express
- **Validar:** Use [@mako-spec/cli](https://www.npmjs.com/package/@mako-spec/cli) para validar seus arquivos MAKO

O protocolo e codigo aberto sob a licenca Apache 2.0. A especificacao completa esta disponivel em [makospec.vercel.app/docs](https://makospec.vercel.app/pt/docs).

## Proximos Passos

Estamos trabalhando no MAKO Score — uma ferramenta de auditoria que mede o quao preparado para IA qualquer site esta em quatro dimensoes: Descobrivel, Legivel, Confiavel e Acionavel. Verifique seu site em [makospec.vercel.app/score](https://makospec.vercel.app/pt/score).

A web esta ganhando um novo publico. O MAKO ajuda voce a falar a lingua deles.
