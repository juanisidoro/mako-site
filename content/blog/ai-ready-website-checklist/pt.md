---
title: "Checklist de Site Pronto para IA: 20 Passos para Otimizar para Agentes de IA"
description: "Um checklist pr\u00e1tico para tornar seu site leg\u00edvel, descobr\u00edvel e acion\u00e1vel para ChatGPT, Claude, Perplexity e qualquer agente de IA."
---

# Checklist de Site Pronto para IA

Os agentes de IA representam uma parcela crescente do tr\u00e1fego do seu site. ChatGPT, Claude, Perplexity, assistentes de compras e bots de pesquisa visitam milh\u00f5es de p\u00e1ginas todos os dias \u2014 mas a maioria dos sites n\u00e3o foi constru\u00edda para eles.

Este checklist cobre 20 passos concretos que voc\u00ea pode implementar hoje, organizados pelas quatro dimens\u00f5es que importam: **Descobr\u00edvel**, **Leg\u00edvel**, **Confi\u00e1vel** e **Acion\u00e1vel**.

## Descobr\u00edvel: Os Agentes de IA Conseguem Encontrar Voc\u00ea?

Se os agentes n\u00e3o conseguem descobrir seu conte\u00fado, nada mais importa.

### 1. Permita crawlers de IA no robots.txt

Verifique se o seu `robots.txt` n\u00e3o bloqueia crawlers de IA. Muitos sites bloqueiam inadvertidamente user agents como `GPTBot`, `ClaudeBot` ou `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Adicione um sitemap.xml

Um sitemap ajuda os agentes a descobrir todas as suas p\u00e1ginas sem precisar rastrear link por link. Certifique-se de que esteja referenciado no seu `robots.txt` e inclua todas as p\u00e1ginas importantes.

### 3. Adicione um arquivo llms.txt

O [padr\u00e3o llms.txt](https://llmstxt.org) informa aos agentes de IA o que seu site oferece e como acess\u00e1-lo. Pense nele como um `robots.txt` para LLMs \u2014 um arquivo de instru\u00e7\u00f5es no n\u00edvel do site.

### 4. Adicione dados estruturados (JSON-LD)

Marca\u00e7\u00e3o Schema.org em formato JSON-LD ajuda os agentes a entender o assunto da sua p\u00e1gina sem precisar analisar o HTML. Inclua pelo menos `@type`, `name`, `description` e as propriedades relevantes para seu tipo de conte\u00fado.

### 5. Adicione tags Open Graph

Tags Open Graph (`og:title`, `og:description`, `og:type`, `og:image`) s\u00e3o usadas por agentes de IA para pr\u00e9-visualizar e classificar conte\u00fado, n\u00e3o apenas por plataformas sociais.

## Leg\u00edvel: Os Agentes de IA Conseguem Entender Voc\u00ea?

A maioria das p\u00e1ginas web \u00e9 90%+ de c\u00f3digo desnecess\u00e1rio. Os agentes precisam de conte\u00fado limpo e estruturado.

### 6. Use HTML sem\u00e2ntico

Tags como `<main>`, `<article>`, `<section>` e `<aside>` indicam aos agentes onde o conte\u00fado real est\u00e1. Sem elas, o agente v\u00ea uma sopa desestruturada de elementos `<div>`.

### 7. Adicione um \u00fanico H1 descritivo

O H1 \u00e9 o principal sinal que os agentes usam para entender o assunto de uma p\u00e1gina. Use exatamente um, e torne-o descritivo \u2014 n\u00e3o "Bem-vindo" ou "In\u00edcio."

### 8. Use t\u00edtulos significativos

Os t\u00edtulos (`<h2>`, `<h3>`) devem resumir o conte\u00fado da se\u00e7\u00e3o. Os agentes os utilizam para leitura inteligente \u2014 compreendendo a estrutura sem ler tudo. Evite t\u00edtulos gen\u00e9ricos como "Mais Informa\u00e7\u00f5es."

### 9. Adicione texto alternativo \u00e0s imagens

Sem texto alternativo, as imagens s\u00e3o invis\u00edveis para os agentes de IA. Com ele, os agentes compreendem seu conte\u00fado visual e podem referenci\u00e1-lo em respostas.

### 10. Use texto descritivo nos links

Substitua textos gen\u00e9ricos em links ("clique aqui", "leia mais", "saiba mais") por r\u00f3tulos descritivos. Os agentes usam o texto do link para decidir se vale a pena segui-lo.

### 11. N\u00e3o dependa de JavaScript para o conte\u00fado

Agentes de IA e crawlers n\u00e3o conseguem executar JavaScript. Se o seu conte\u00fado depende de renderiza\u00e7\u00e3o no lado do cliente (React, Vue, Angular SPAs sem SSR), ele \u00e9 invis\u00edvel para qualquer agente de IA. Use SSR ou gera\u00e7\u00e3o est\u00e1tica.

### 12. Reduza a infla\u00e7\u00e3o do HTML

Remova estilos inline desnecess\u00e1rios, elementos vazios e marca\u00e7\u00e3o n\u00e3o sem\u00e2ntica. Quanto menos ru\u00eddo no seu HTML, melhor a rela\u00e7\u00e3o sinal-ru\u00eddo que os agentes experimentam.

## Confi\u00e1vel: Os Agentes de IA Podem Confiar em Voc\u00ea?

Sinais de confian\u00e7a ajudam os agentes a verificar a precis\u00e3o e decidir se devem citar sua p\u00e1gina.

### 13. Adicione uma meta description

A meta description \u00e9 o resumo r\u00e1pido que os agentes usam quando n\u00e3o leem a p\u00e1gina inteira. Mantenha-a com menos de 160 caracteres, espec\u00edfica e precisa.

### 14. Defina uma URL canonical

`<link rel="canonical">` evita que os agentes indexem vers\u00f5es duplicadas do seu conte\u00fado. Essencial se voc\u00ea tem par\u00e2metros de URL, pagina\u00e7\u00e3o ou vers\u00f5es para impress\u00e3o.

### 15. Declare o idioma

O atributo `lang` no `<html>` informa aos agentes em que idioma est\u00e1 o seu conte\u00fado. Simples, mas frequentemente ausente \u2014 e afeta diretamente a compreens\u00e3o.

```html
<html lang="pt">
```

### 16. Mantenha o conte\u00fado atualizado

Os agentes prestam aten\u00e7\u00e3o \u00e0s datas. Inclua `datePublished` e `dateModified` nos seus dados estruturados. Conte\u00fado desatualizado perde credibilidade.

### 17. Use headers ETag ou Last-Modified

Esses headers permitem que os agentes verifiquem se o conte\u00fado mudou sem precisar baix\u00e1-lo novamente. Cache eficiente sinaliza um site bem mantido.

## Acion\u00e1vel: Os Agentes de IA Podem Interagir com Voc\u00ea?

O futuro da web de agentes \u00e9 transacional. Se os agentes n\u00e3o encontram suas a\u00e7\u00f5es, voc\u00ea perde convers\u00f5es.

### 18. Defina CTAs claros no conte\u00fado

Seus bot\u00f5es "Comprar Agora", "Assinar", "Agendar uma Demo" devem estar claros no conte\u00fado HTML, n\u00e3o apenas visualmente estilizados. Os agentes identificam a\u00e7\u00f5es pelo texto e pela estrutura HTML, n\u00e3o pelo CSS.

### 19. Use links sem\u00e2nticos com contexto

Os links devem ter texto descritivo que explique para onde levam. Em vez de "Clique aqui para ver os pre\u00e7os", use "Ver planos de pre\u00e7os." Isso ajuda os agentes a navegar pelo seu site com prop\u00f3sito.

### 20. Coloque seu conte\u00fado principal primeiro

Os agentes analisam os primeiros centenas de caracteres para decidir se a p\u00e1gina \u00e9 relevante. Se encontram apenas navega\u00e7\u00e3o ou c\u00f3digo desnecess\u00e1rio antes do conte\u00fado real, podem pular sua p\u00e1gina completamente. Mova seu H1 e conte\u00fado principal o mais alto poss\u00edvel no HTML.

## Al\u00e9m do Checklist: O N\u00edvel MAKO

Tudo acima torna seu site melhor para agentes de IA usando o formato HTML existente. Mas h\u00e1 um limite \u2014 mesmo HTML perfeitamente otimizado ainda envia **15-20x mais tokens** do que o necess\u00e1rio.

O pr\u00f3ximo n\u00edvel \u00e9 servir conte\u00fado estruturado e nativo para IA junto com seu HTML atrav\u00e9s de content negotiation. \u00c9 isso que o [protocolo MAKO](https://makospec.vercel.app/pt/docs) possibilita: mesma URL, mesmo servidor, mas quando um agente de IA visita, ele recebe markdown otimizado com metadados em vez de HTML bruto.

O resultado: **~94% menos tokens**, a\u00e7\u00f5es declaradas que os agentes podem executar e links sem\u00e2nticos que podem seguir com prop\u00f3sito.

## Avalie Onde Voc\u00ea Est\u00e1

Cada item deste checklist corresponde a uma verifica\u00e7\u00e3o espec\u00edfica no [MAKO Score](https://makospec.vercel.app/pt/score) \u2014 uma auditoria gratuita que mede seu site nas quatro dimens\u00f5es (Descobr\u00edvel, Leg\u00edvel, Confi\u00e1vel, Acion\u00e1vel) e atribui uma pontua\u00e7\u00e3o de 0 a 100.

A maioria dos sites sem otimiza\u00e7\u00e3o pontua entre 30-40. Com este checklist, voc\u00ea pode alcan\u00e7ar 60+. Com MAKO, 90+.

[Verifique seu AI Score agora](https://makospec.vercel.app/pt/score).
