---
title: "O Que É WebMCP e Como Adicionar ao Seu Site"
description: "WebMCP é o novo padrão W3C que permite aos agentes IA interagir com seu site através de formulários HTML. Aprenda a implementá-lo com poucos atributos."
---

# O Que É WebMCP e Como Adicionar ao Seu Site

Toda vez que um agente de IA quer comprar algo, pesquisar um produto ou reservar uma mesa num site, ele tem que fingir ser humano. Abrir um navegador, olhar a tela, clicar em botões, adivinhar o que cada campo faz.

Funciona — mais ou menos. Mas é lento, frágil e quebra constantemente.

WebMCP resolve isso. Você adiciona alguns atributos HTML aos formulários que já tem, e os agentes IA sabem instantaneamente o que seu site pode fazer.

## O Que É WebMCP

WebMCP (Web Model Context Protocol) é um [padrão do W3C](https://webmachinelearning.github.io/webmcp/) apoiado pelo Google e pela Microsoft. Ele permite que sites declarem suas capacidades interativas para que agentes IA as utilizem diretamente — sem scraping de tela, sem adivinhação.

Você já tem formulários: uma barra de busca, um fluxo de checkout, um widget de reservas. WebMCP permite rotular esses formulários com atributos semânticos para que os agentes os entendam como ferramentas estruturadas.

Foi lançado no [Chrome 146](https://developer.chrome.com/blog/webmcp-epp) (fevereiro de 2026) como early preview. Firefox, Safari e Edge participam do [grupo de trabalho do W3C](https://webmachinelearning.github.io/webmcp/).

## Como Funciona: Adicione Atributos aos Seus Formulários

Este é um formulário de busca de produtos sem WebMCP:

```html
<form action="/search">
  <input type="text" name="q" placeholder="Pesquisar produtos...">
  <button type="submit">Pesquisar</button>
</form>
```

Um humano vê um campo de busca. Um agente IA vê... um campo de texto. Ele não sabe o que busca, o que digitar, nem o que acontece ao enviar.

Agora o mesmo formulário com WebMCP:

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="Pesquisar nosso catálogo de mais de 3.000 produtos por nome, marca ou categoria"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="Consulta"
         toolparamdescription="Nome do produto, marca ou categoria a pesquisar">

  <button type="submit">Pesquisar</button>
</form>
```

Três atributos no formulário, dois no input. O agente agora sabe exatamente o que esta ferramenta faz e pode usá-la com total confiança.

### Os Atributos

**Em `<form>`:**

| Atributo | Obrigatório | Função |
|---|---|---|
| `toolname` | Sim | Identificador único da ferramenta |
| `tooldescription` | Sim | Descrição em linguagem natural do que o formulário faz |
| `toolautosubmit` | Não | Enviar automaticamente quando o agente preencher todos os campos |

**Em `<input>`, `<select>`, `<textarea>`:**

| Atributo | Função |
|---|---|
| `toolparamtitle` | Rótulo curto para o campo |
| `toolparamdescription` | Que dado vai aqui (útil quando o rótulo não é óbvio) |

## Exemplos para E-Commerce

### Busca de Produtos com Filtros

```html
<form action="/produtos"
      toolname="find_products"
      tooldescription="Pesquisar produtos com filtros opcionais de preço e categoria">

  <input type="text" name="q"
         toolparamtitle="Busca"
         toolparamdescription="Nome ou palavra-chave do produto">

  <select name="category"
          toolparamtitle="Categoria"
          toolparamdescription="Filtrar por categoria de produto">
    <option value="">Todas as categorias</option>
    <option value="electronics">Eletrônicos</option>
    <option value="clothing">Roupas</option>
    <option value="home">Casa e Jardim</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="Preço máximo"
         toolparamdescription="Preço máximo em BRL">

  <button type="submit">Pesquisar</button>
</form>
```

Quando alguém pede a um assistente IA _"Encontre fones de ouvido por menos de R$250"_, o agente preenche a consulta, seleciona a categoria, define o preço máximo e envia. Sem adivinhar o DOM.

### Adicionar ao Carrinho

```html
<form action="/carrinho/add" method="POST"
      toolname="add_to_cart"
      tooldescription="Adicionar um produto ao carrinho de compras pelo SKU e quantidade"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="Identificador SKU do produto">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="Quantidade"
         toolparamdescription="Número de unidades a adicionar">

  <button type="submit">Adicionar ao carrinho</button>
</form>
```

### Verificar Estoque por CEP

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="Verificar se um produto está disponível para retirada em uma loja próxima a um CEP"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="CEP"
         toolparamdescription="CEP de 8 dígitos para encontrar lojas próximas">

  <button type="submit">Verificar disponibilidade</button>
</form>
```

## A API JavaScript

Para ferramentas dinâmicas que não podem ser representadas como formulários estáticos, use a API imperativa:

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "Calcular o custo de frete e data de entrega para um carrinho",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "CEP de destino"
      },
      method: {
        type: "string",
        description: "Método de envio: standard, express ou overnight"
      }
    },
    required: ["zip"]
  },
  execute: async (input) => {
    const res = await fetch(`/api/shipping?zip=${input.zip}&method=${input.method || 'standard'}`);
    return await res.json();
  }
});
```

A API `navigator.modelContext` também oferece:
- `provideContext()` — Registrar várias ferramentas de uma vez
- `unregisterTool(name)` — Remover uma ferramenta específica
- `clearContext()` — Remover todas as ferramentas registradas

Referência completa: [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/).

## Como Testar

1. Baixe o [Chrome Canary](https://www.google.com/chrome/canary/)
2. Acesse `chrome://flags/` e ative **"WebMCP for testing"**
3. Instale a extensão WebMCP do Chrome (usa uma chave de API gratuita do Gemini pelo [Google AI Studio](https://aistudio.google.com))
4. Abra qualquer página com atributos WebMCP — o agente pode interagir com seus formulários

## Por Que Fazer Isso Agora

Adicionar WebMCP é trivial. Dois ou três atributos em formulários que já existem. Sem mudanças no backend, sem arquivos novos, sem APIs para construir.

Sem esses atributos, os agentes IA continuarão tentando usar seu site — mas por meio de automação de tela lenta e pouco confiável. Com eles, os agentes interagem com seus formulários como um desenvolvedor usaria sua API: direta e precisamente.

A adoção antecipada importa. Conforme mais agentes suportarem WebMCP, os sites que já declaram suas ferramentas receberão as interações. Os que não declararem serão scrapeados — mal.

## WebMCP + llms.txt + MAKO

Três padrões, três camadas:

| Padrão | Camada | O que faz |
|---|---|---|
| **[llms.txt](/pt/blog/como-criar-llms-txt)** | Descoberta | Diz aos agentes sobre o que é seu site |
| **WebMCP** | Interação | Permite que agentes usem seus formulários e ferramentas |
| **[MAKO](https://makospec.vercel.app/pt/docs)** | Conteúdo | Serve conteúdo otimizado para IA por página |

llms.txt é o mapa. WebMCP é a interface. MAKO é o conteúdo. Juntos, tornam seu site totalmente acessível para cada agente IA que o visitar.

## Referências

- [Especificação W3C WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Chrome Blog: WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — Demos e utilitários oficiais
