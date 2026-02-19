---
title: "Checklist para Web Preparada para IA: 20 Pasos para Optimizar tu Sitio"
description: "Una checklist práctica para que tu web sea legible, descubrible y accionable por ChatGPT, Claude, Perplexity y cualquier agente IA."
---

# Checklist para Web Preparada para IA

Los agentes IA son una parte creciente del tráfico de tu sitio web. ChatGPT, Claude, Perplexity, asistentes de compras y bots de investigación visitan millones de páginas cada día — pero la mayoría de los sitios no están preparados para ellos.

Esta checklist cubre 20 pasos concretos que puedes implementar hoy, organizados por las cuatro dimensiones que importan: **Descubrible**, **Legible**, **Confiable** y **Accionable**.

## Descubrible: ¿Pueden los Agentes IA Encontrarte?

Si los agentes no pueden descubrir tu contenido, nada más importa.

### 1. Permite crawlers IA en robots.txt

Comprueba que tu `robots.txt` no bloquee crawlers IA. Muchos sitios bloquean inadvertidamente user agents como `GPTBot`, `ClaudeBot` o `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Añade un sitemap.xml

Un sitemap ayuda a los agentes a descubrir todas tus páginas sin tener que navegar enlace por enlace. Asegúrate de que esté referenciado en tu `robots.txt` e incluya todas las páginas importantes.

### 3. Añade un archivo llms.txt

El [estándar llms.txt](https://llmstxt.org) indica a los agentes IA qué ofrece tu sitio y cómo acceder. Piensa en él como `robots.txt` para LLMs — un archivo de instrucciones a nivel de sitio.

### 4. Añade datos estructurados (JSON-LD)

El markup Schema.org en formato JSON-LD ayuda a los agentes a entender de qué trata tu página sin parsear el HTML. Incluye al menos `@type`, `name`, `description` y las propiedades relevantes para tu tipo de contenido.

### 5. Añade etiquetas Open Graph

Las etiquetas Open Graph (`og:title`, `og:description`, `og:type`, `og:image`) son utilizadas por agentes IA para previsualizar y clasificar contenido, no solo por plataformas sociales.

## Legible: ¿Pueden los Agentes IA Entenderte?

La mayoría de las páginas web son 90%+ de código repetitivo. Los agentes necesitan contenido limpio y estructurado.

### 6. Usa HTML semántico

Etiquetas como `<main>`, `<article>`, `<section>` y `<aside>` indican a los agentes dónde está el contenido real. Sin ellas, el agente ve una sopa plana de elementos `<div>`.

### 7. Añade un único H1 descriptivo

El H1 es la señal principal que los agentes usan para entender de qué trata una página. Usa exactamente uno, y que sea descriptivo — no "Bienvenido" ni "Inicio."

### 8. Usa encabezados significativos

Los encabezados (`<h2>`, `<h3>`) deben resumir el contenido de la sección. Los agentes los usan para un escaneo inteligente — entender la estructura sin leer todo. Evita encabezados genéricos como "Más Información."

### 9. Añade texto alternativo a las imágenes

Sin texto alternativo, las imágenes son invisibles para los agentes IA. Con él, los agentes entienden tu contenido visual y pueden referenciarlo en sus respuestas.

### 10. Usa texto descriptivo en los enlaces

Reemplaza texto genérico en enlaces ("haz clic aquí," "leer más," "saber más") con etiquetas descriptivas. Los agentes usan el texto de los enlaces para decidir si vale la pena seguirlos.

### 11. No dependas de JavaScript para el contenido

Los agentes IA y crawlers no pueden ejecutar JavaScript. Si tu contenido requiere renderizado del lado del cliente (React, Vue, Angular SPAs sin SSR), es invisible para cualquier agente IA. Usa SSR o generación estática.

### 12. Reduce el bloat del HTML

Elimina estilos inline innecesarios, elementos vacíos y markup no semántico. Cuanto menos ruido en tu HTML, mejor la relación señal-ruido que experimentan los agentes.

## Confiable: ¿Pueden los Agentes IA Confiar en Ti?

Las señales de confianza ayudan a los agentes a verificar la precisión y decidir si citar tu página.

### 13. Añade una meta description

La meta description es el resumen rápido que usan los agentes cuando no leen la página completa. Mantenla bajo 160 caracteres, específica y precisa.

### 14. Establece una URL canónica

`<link rel="canonical">` evita que los agentes indexen versiones duplicadas de tu contenido. Esencial si tienes parámetros URL, paginación o versiones de impresión.

### 15. Declara el idioma

El atributo `lang` en `<html>` indica a los agentes en qué idioma está tu contenido. Simple, pero a menudo ausente — y afecta directamente a la comprensión.

```html
<html lang="es">
```

### 16. Mantén el contenido actualizado

Los agentes prestan atención a las fechas. Incluye `datePublished` y `dateModified` en tus datos estructurados. El contenido desactualizado pierde confianza.

### 17. Usa headers ETag o Last-Modified

Estos headers permiten a los agentes comprobar si el contenido cambió sin volver a descargarlo todo. El caché eficiente señala un sitio bien mantenido.

## Accionable: ¿Pueden los Agentes IA Interactuar Contigo?

El futuro de la web de agentes es transaccional. Si los agentes no encuentran tus acciones, pierdes conversiones.

### 18. Define CTAs claros en el contenido

Tus botones "Comprar Ahora," "Suscribirse," "Reservar Demo" deben ser claros en el contenido HTML, no solo visualmente estilizados. Los agentes identifican acciones por texto y estructura HTML, no por CSS.

### 19. Usa enlaces semánticos con contexto

Los enlaces deben tener texto descriptivo que explique a dónde llevan. En lugar de "Haz clic aquí para ver precios," usa "Ver planes de precios." Esto ayuda a los agentes a navegar tu sitio con propósito.

### 20. Pon tu contenido principal primero

Los agentes escanean los primeros cientos de caracteres para decidir si una página es relevante. Si solo encuentran navegación o boilerplate antes del contenido real, pueden saltarse tu página. Mueve tu H1 y contenido principal lo más arriba posible en el HTML.

## Más Allá de la Checklist: El Nivel MAKO

Todo lo anterior mejora tu sitio para agentes IA usando el formato HTML existente. Pero hay un techo — incluso HTML perfectamente optimizado envía **15-20x más tokens** de los necesarios.

El siguiente nivel es servir contenido estructurado y nativo para IA junto a tu HTML mediante negociación de contenido. Eso es lo que el [protocolo MAKO](https://makospec.vercel.app/es/docs) hace posible: misma URL, mismo servidor, pero cuando un agente IA visita, recibe markdown optimizado con metadatos en lugar de HTML crudo.

El resultado: **~94% menos tokens**, acciones declaradas que los agentes pueden ejecutar, y enlaces semánticos que pueden seguir con propósito.

## Mide Dónde Estás

Cada elemento de esta checklist corresponde a un check específico en [MAKO Score](https://makospec.vercel.app/es/score) — una auditoría gratuita que mide tu sitio en las cuatro dimensiones (Descubrible, Legible, Confiable, Accionable) y te da una puntuación de 0 a 100.

La mayoría de sitios sin optimización puntúan 30-40. Con esta checklist, puedes alcanzar 60+. Con MAKO, 90+.

[Comprueba tu AI Score ahora](https://makospec.vercel.app/es/score).
