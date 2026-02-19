---
title: "Checklist de Site Pronto para IA: 21 Passos para Otimizar para Agentes de IA"
description: "Um checklist prático para tornar seu site legível, descobrível e acionável para ChatGPT, Claude, Perplexity e qualquer agente de IA."
---

# Checklist de Site Pronto para IA

Os agentes de IA representam uma parcela crescente do tráfego do seu site. ChatGPT, Claude, Perplexity, assistentes de compras e bots de pesquisa visitam milhões de páginas todos os dias — mas a maioria dos sites não foi construída para eles.

Este checklist cobre 21 passos concretos que você pode implementar hoje, organizados pelas quatro dimensões que importam: **Descobrível**, **Legível**, **Confiável** e **Acionável**.

## Descobrível: Os Agentes de IA Conseguem Encontrar Você?

Se os agentes não conseguem descobrir seu conteúdo, nada mais importa.

### 1. Permita crawlers de IA no robots.txt

Verifique se o seu `robots.txt` não bloqueia crawlers de IA. Muitos sites bloqueiam inadvertidamente user agents como `GPTBot`, `ClaudeBot` ou `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Adicione um sitemap.xml

Um sitemap ajuda os agentes a descobrir todas as suas páginas sem precisar rastrear link por link. Certifique-se de que esteja referenciado no seu `robots.txt` e inclua todas as páginas importantes.

### 3. Adicione um arquivo llms.txt

O [padrão llms.txt](https://llmstxt.org) informa aos agentes de IA o que seu site oferece e como acessá-lo. Pense nele como um `robots.txt` para LLMs — um arquivo de instruções no nível do site. Consulte nosso [guia para criar um llms.txt eficaz](/pt/blog/como-criar-llms-txt).

### 4. Adicione dados estruturados (JSON-LD)

Marcação Schema.org em formato JSON-LD ajuda os agentes a entender o assunto da sua página sem precisar analisar o HTML. Inclua pelo menos `@type`, `name`, `description` e as propriedades relevantes para seu tipo de conteúdo.

### 5. Adicione tags Open Graph

Tags Open Graph (`og:title`, `og:description`, `og:type`, `og:image`) são usadas por agentes de IA para pré-visualizar e classificar conteúdo, não apenas por plataformas sociais.

### 6. Adicione atributos WebMCP aos seus formulários

[WebMCP](https://webmachinelearning.github.io/webmcp/) é um padrão do W3C que permite declarar seus formulários como ferramentas para agentes IA. Adicione os atributos `toolname` e `tooldescription` aos seus elementos `<form>` para que os agentes possam descobri-los e usá-los diretamente — sem scraping de tela. Consulte nosso [guia de WebMCP](/pt/blog/como-implementar-webmcp).

## Legível: Os Agentes de IA Conseguem Entender Você?

A maioria das páginas web é 90%+ de código desnecessário. Os agentes precisam de conteúdo limpo e estruturado.

### 7. Use HTML semântico

Tags como `<main>`, `<article>`, `<section>` e `<aside>` indicam aos agentes onde o conteúdo real está. Sem elas, o agente vê uma sopa desestruturada de elementos `<div>`.

### 8. Adicione um único H1 descritivo

O H1 é o principal sinal que os agentes usam para entender o assunto de uma página. Use exatamente um, e torne-o descritivo — não "Bem-vindo" ou "Início."

### 9. Use títulos significativos

Os títulos (`<h2>`, `<h3>`) devem resumir o conteúdo da seção. Os agentes os utilizam para leitura inteligente — compreendendo a estrutura sem ler tudo. Evite títulos genéricos como "Mais Informações."

### 10. Adicione texto alternativo às imagens

Sem texto alternativo, as imagens são invisíveis para os agentes de IA. Com ele, os agentes compreendem seu conteúdo visual e podem referenciá-lo em respostas.

### 11. Use texto descritivo nos links

Substitua textos genéricos em links ("clique aqui", "leia mais", "saiba mais") por rótulos descritivos. Os agentes usam o texto do link para decidir se vale a pena segui-lo.

### 12. Não dependa de JavaScript para o conteúdo

Agentes de IA e crawlers não conseguem executar JavaScript. Se o seu conteúdo depende de renderização no lado do cliente (React, Vue, Angular SPAs sem SSR), ele é invisível para qualquer agente de IA. Use SSR ou geração estática.

### 13. Reduza a inflação do HTML

Remova estilos inline desnecessários, elementos vazios e marcação não semântica. Quanto menos ruído no seu HTML, melhor a relação sinal-ruído que os agentes experimentam.

## Confiável: Os Agentes de IA Podem Confiar em Você?

Sinais de confiança ajudam os agentes a verificar a precisão e decidir se devem citar sua página.

### 14. Adicione uma meta description

A meta description é o resumo rápido que os agentes usam quando não leem a página inteira. Mantenha-a com menos de 160 caracteres, específica e precisa.

### 15. Defina uma URL canonical

`<link rel="canonical">` evita que os agentes indexem versões duplicadas do seu conteúdo. Essencial se você tem parâmetros de URL, paginação ou versões para impressão.

### 16. Declare o idioma

O atributo `lang` no `<html>` informa aos agentes em que idioma está o seu conteúdo. Simples, mas frequentemente ausente — e afeta diretamente a compreensão.

```html
<html lang="pt">
```

### 17. Mantenha o conteúdo atualizado

Os agentes prestam atenção às datas. Inclua `datePublished` e `dateModified` nos seus dados estruturados. Conteúdo desatualizado perde credibilidade.

### 18. Use headers ETag ou Last-Modified

Esses headers permitem que os agentes verifiquem se o conteúdo mudou sem precisar baixá-lo novamente. Cache eficiente sinaliza um site bem mantido.

## Acionável: Os Agentes de IA Podem Interagir com Você?

O futuro da web de agentes é transacional. Se os agentes não encontram suas ações, você perde conversões.

### 19. Defina CTAs claros no conteúdo

Seus botões "Comprar Agora", "Assinar", "Agendar uma Demo" devem estar claros no conteúdo HTML, não apenas visualmente estilizados. Os agentes identificam ações pelo texto e pela estrutura HTML, não pelo CSS.

### 20. Use links semânticos com contexto

Os links devem ter texto descritivo que explique para onde levam. Em vez de "Clique aqui para ver os preços", use "Ver planos de preços." Isso ajuda os agentes a navegar pelo seu site com propósito.

### 21. Coloque seu conteúdo principal primeiro

Os agentes analisam os primeiros centenas de caracteres para decidir se a página é relevante. Se encontram apenas navegação ou código desnecessário antes do conteúdo real, podem pular sua página completamente. Mova seu H1 e conteúdo principal o mais alto possível no HTML.

## Além do Checklist: O Nível MAKO

Tudo acima torna seu site melhor para agentes de IA usando o formato HTML existente. Mas há um limite — mesmo HTML perfeitamente otimizado ainda envia **15-20x mais tokens** do que o necessário.

O próximo nível é servir conteúdo estruturado e nativo para IA junto com seu HTML através de content negotiation. É isso que o [protocolo MAKO](https://makospec.vercel.app/pt/docs) possibilita: mesma URL, mesmo servidor, mas quando um agente de IA visita, ele recebe markdown otimizado com metadados em vez de HTML bruto.

O resultado: **~94% menos tokens**, ações declaradas que os agentes podem executar e links semânticos que podem seguir com propósito.

## Avalie Onde Você Está

Cada item deste checklist corresponde a uma verificação específica no [MAKO Score](https://makospec.vercel.app/pt/score) — uma auditoria gratuita que mede seu site nas quatro dimensões (Descobrível, Legível, Confiável, Acionável) e atribui uma pontuação de 0 a 100.

A maioria dos sites sem otimização pontua entre 30-40. Com este checklist, você pode alcançar 60+. Com MAKO, 90+.

[Verifique seu AI Score agora](https://makospec.vercel.app/pt/score).