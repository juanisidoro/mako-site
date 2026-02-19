---
title: "O Que Acontece Quando um Agente de IA Visita Seu Site"
description: "A jornada invisivel da requisicao HTTP ao raciocinio — e por que 93% do que seu servidor envia e ruido que um agente de IA nao consegue usar."
---

# O Que Acontece Quando um Agente de IA Visita Seu Site

Todos os dias, milhoes de agentes de IA visitam sites. ChatGPT, Claude, Perplexity, assistentes de compras, bots de pesquisa — todos precisam ler conteudo da web. Mas nenhum deles ve seu site da mesma forma que um humano.

Sem CSS. Sem layouts renderizados. Sem imagens (geralmente). Apenas texto bruto extraido do codigo-fonte HTML.

Veja o que realmente acontece, passo a passo.

## Passo 1: O Agente Recebe uma URL

Um usuario pergunta algo como "Compare precos de fones de ouvido sem fio nesta loja." O agente de IA identifica a URL relevante e se prepara para busca-la.

O agente em si nao possui um navegador. Ele delega a uma ferramenta — normalmente um cliente HTTP ou um servico especializado de busca web — que fara a requisicao em seu nome.

## Passo 2: Uma Requisicao HTTP e Feita

A ferramenta envia uma requisicao `GET` padrao ao seu servidor. Seu servidor nao sabe (e nem se importa) que o visitante e um agente de IA — ele responde com o mesmo HTML que enviaria a qualquer navegador.

A resposta normalmente inclui:
- Barras de navegacao e menus (47+ links)
- Banners de consentimento de cookies e scripts
- Folhas de estilo CSS (inline e externas)
- Pacotes JavaScript
- Scripts de publicidade e pixels de rastreamento
- O conteudo real, enterrado em algum lugar no meio

Para uma pagina de produto de e-commerce tipica, isso significa **181 KB de HTML** — aproximadamente **4.125 tokens** na janela de contexto de um LLM.

## Passo 3: Extracao de Conteudo

O HTML bruto e ruidoso e caro em tokens demais para ser passado diretamente ao modelo de IA. Entao a ferramenta de busca aplica uma etapa de pre-processamento:

1. **Remover tags irrelevantes:** `<script>`, `<style>`, `<nav>`, `<footer>`, pixels de rastreamento
2. **Extrair texto legivel:** paragrafos, titulos, listas, tabelas
3. **Converter para markdown** (as vezes) para compactacao
4. **Truncar** para caber nos limites de tokens

Essa extracao e heuristica e imperfeita. A ferramenta nao sabe qual `<div>` contem o preco do seu produto e qual contem um banner de cookies. Ela adivinha com base na estrutura do HTML — e frequentemente erra.

## Passo 4: O Texto Entra na Janela de Contexto

O texto limpo chega na janela de contexto da IA como se fosse uma mensagem comum. O agente nao "ve" a pagina — ele le um documento de texto que pode ou nao representar com precisao o que um humano veria.

Restricoes importantes neste ponto:
- **A janela de contexto e finita.** Um modelo de 128K tokens parece espacoso, mas uma unica pagina ruidosa pode consumir 3-5% dela
- **Sem informacao visual.** Imagens, graficos e layouts sao invisiveis a menos que texto alternativo seja fornecido
- **Sem interacao.** O agente nao pode clicar em botoes, preencher formularios ou rolar a pagina

## Passo 5: O Agente Raciocina

A partir do texto extraido, o agente tenta responder a pergunta do usuario. Ele identifica nomes de produtos, precos, descricoes e qualquer informacao estruturada que consiga encontrar.

Se a extracao foi limpa, o agente da uma otima resposta. Se a extracao perdeu o preco (porque foi renderizado por JavaScript) ou incluiu texto de banner de cookies como se fosse informacao do produto, a resposta e errada ou incompleta.

## As Limitacoes Sao Estruturais

Isso nao e um problema de um modelo de IA especifico. E um problema estrutural de como a web serve conteudo:

**Sem execucao de JavaScript.** Se seu conteudo e renderizado no lado do cliente (SPAs em React, Vue, Angular), o agente de IA ve um `<div id="root"></div>` vazio e nada mais. Seu site inteiro fica invisivel.

**Sem estado ou sessoes.** Cada requisicao e independente. O agente nao pode fazer login, manter um carrinho de compras ou acessar conteudo restrito.

**Sem navegacao intencional.** O agente nao sabe qual dos seus 47 links de navegacao leva a conteudo relevante e qual leva a sua politica de privacidade. Todo link e igualmente opaco.

**Truncamento causa perdas.** Quando uma pagina e longa demais, a ferramenta corta conteudo — e pode cortar justamente a parte mais importante.

## O Que Isso Significa Para o Seu Negocio

Se seu site depende de trafego de IA — e cada vez mais depende — o modelo atual e profundamente ineficiente:

| O que acontece | Impacto |
|---|---|
| Agente baixa 181 KB de HTML | Desperidca tokens com ruido |
| Extracao de conteudo erra | Informacoes imprecisas sobre seus produtos |
| Conteudo renderizado por JavaScript | Completamente invisivel para agentes |
| Sem acoes estruturadas | Agente nao encontra seus botoes "Comprar" ou "Assinar" |
| Sem links semanticos | Agente navega as cegas em vez de navegar com proposito |

A web serve **um unico formato para dois publicos completamente diferentes.** Navegadores precisam de HTML, CSS e JavaScript. Agentes de IA precisam de texto estruturado, metadados e acoes declaradas.

## Uma Abordagem Melhor

E se seu servidor pudesse detectar que o visitante e um agente de IA e responder exatamente com o que ele precisa?

Essa e a ideia central por tras da negociacao de conteudo para IA — e e o que o [protocolo MAKO](https://makospec.vercel.app/pt/docs) possibilita. Em vez de 4.125 tokens de HTML ruidoso, o agente recebe ~276 tokens de markdown estruturado e rico em metadados. Mesma URL, mesmo servidor, resposta diferente.

**Quer ver como agentes de IA experimentam seu site hoje?** [Verifique seu MAKO Score](https://makospec.vercel.app/pt/score) — uma auditoria gratuita de Descoberta, Legibilidade, Confiabilidade e Acionabilidade.
