---
title: "Presentando MAKO: El Protocolo Abierto para Contenido Optimizado para IA"
description: "Por qué construimos MAKO y cómo reduce el consumo de tokens un 94% mientras hace cada página web comprensible para agentes IA."
---

# Presentando MAKO

La web no fue diseñada para agentes IA. Cada vez que ChatGPT, Perplexity o un asistente de compras visita un sitio web, descarga barras de navegación, banners de cookies, scripts publicitarios y miles de líneas de markup — solo para encontrar el nombre y precio de un producto.

¿El resultado? **Más de 4.000 tokens consumidos** antes de que el agente llegue al contenido real. Para las SPAs renderizadas con JavaScript, la situación es peor: el agente ve un `<div id="root"></div>` vacío y nada más.

## El Problema

Consideremos una página típica de producto e-commerce. Un visitante humano ve un diseño limpio con imagen del producto, título, precio y un botón "Añadir al carrito". Un agente IA ve esto:

- 181 KB de HTML crudo
- Navegación con 47 enlaces
- 3 scripts de consentimiento de cookies
- CSS inline para más de 200 componentes
- Los datos reales del producto enterrados en algún lugar del medio

Esto es **93% ruido, 7% señal**.

## Qué Hace MAKO

MAKO añade una capa estructurada y optimizada para IA a cualquier sitio web usando negociación de contenido HTTP estándar. Cuando un agente IA envía `Accept: text/mako+markdown`, el servidor responde con un documento MAKO limpio en lugar de HTML crudo:

```yaml
---
mako: "1.0"
type: product
entity: "Auriculares Inalámbricos Pro"
tokens: 276
language: es
updated: "2026-02-20T10:00:00Z"
---
```

La misma URL, el mismo servidor — simplemente una respuesta diferente para una audiencia diferente.

## Decisiones de Diseño Clave

**Negociación de contenido sobre nuevos endpoints.** Elegimos el patrón del header `Accept` porque no requiere cambios de URL. Cada página existente puede servir MAKO sin crear rutas duplicadas.

**Markdown sobre JSON.** Los LLMs están entrenados con markdown. Un documento markdown bien estructurado con frontmatter YAML es más eficiente en tokens y más legible naturalmente por modelos de lenguaje que el JSON equivalente.

**10 tipos de contenido.** Producto, artículo, documentación, landing, listado, perfil, evento, receta, FAQ y personalizado. Cada tipo le dice al agente exactamente qué estructura esperar.

**Acciones declaradas.** En lugar de esperar que el agente encuentre tu botón "Añadir al carrito" en el HTML, MAKO declara acciones legibles por máquina con endpoints y parámetros.

## Los Números

En nuestros benchmarks con más de 50 páginas reales:

| Métrica | HTML Crudo | MAKO |
|---------|------------|------|
| Tamaño promedio | 181 KB | 3 KB |
| Tokens promedio | ~4.125 | ~276 |
| Reducción | — | **93%** |

No es una mejora marginal. Es la diferencia entre un agente que puede procesar 3 páginas por ventana de contexto y uno que puede procesar 45.

## Cómo Empezar

MAKO está disponible hoy:

- **WordPress:** Instala el [plugin mako-wp](https://github.com/juanisidoro/mako-wp) — activa y funciona con WooCommerce, Yoast y ACF
- **Cualquier stack:** Usa [@mako-spec/js](https://www.npmjs.com/package/@mako-spec/js) — SDK TypeScript con middleware Express
- **Validar:** Usa [@mako-spec/cli](https://www.npmjs.com/package/@mako-spec/cli) para validar tus archivos MAKO

El protocolo es código abierto bajo Apache 2.0. La especificación completa está disponible en [makospec.vercel.app/docs](https://makospec.vercel.app/es/docs).

## Próximos Pasos

Estamos trabajando en MAKO Score — una herramienta de auditoría que mide cuán preparado para IA está cualquier sitio web en cuatro dimensiones: Descubrible, Legible, Confiable y Accionable. Comprueba tu sitio en [makospec.vercel.app/score](https://makospec.vercel.app/es/score).

La web está ganando una nueva audiencia. MAKO te ayuda a hablar su idioma.
