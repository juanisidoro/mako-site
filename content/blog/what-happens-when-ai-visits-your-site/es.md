---
title: "Qué Pasa Cuando una IA Visita Tu Sitio Web"
description: "El viaje invisible desde la petición HTTP hasta el razonamiento — y por qué el 93% de lo que tu servidor envía es ruido que la IA no puede usar."
---

# Qué Pasa Cuando una IA Visita Tu Sitio Web

Cada día, millones de agentes IA visitan sitios web. ChatGPT, Claude, Perplexity, asistentes de compras, bots de investigación — todos necesitan leer contenido web. Pero ninguno ve tu sitio como lo ve un humano.

Nada de CSS. Nada de layouts renderizados. Nada de imágenes (normalmente). Solo texto crudo extraído del código fuente HTML.

Esto es lo que ocurre realmente, paso a paso.

## Paso 1: El Agente Recibe una URL

Un usuario pregunta algo como "Compara precios de auriculares inalámbricos en esta tienda." El agente IA identifica la URL relevante y se prepara para obtenerla.

El agente en sí no tiene navegador. Delega en una herramienta — típicamente un cliente HTTP o un servicio especializado de web-fetching — que hará la petición en su nombre.

## Paso 2: Se Hace una Petición HTTP

La herramienta envía una petición `GET` estándar a tu servidor. Tu servidor no sabe (ni le importa) que el visitante es un agente IA — responde con el mismo HTML que enviaría a cualquier navegador.

La respuesta típicamente incluye:
- Barras de navegación y menús (más de 47 enlaces)
- Banners de consentimiento de cookies y scripts
- Hojas de estilo CSS (inline y externas)
- Bundles de JavaScript
- Scripts publicitarios y píxeles de rastreo
- El contenido real, enterrado en algún lugar del medio

Para una página típica de producto e-commerce, esto son **181 KB de HTML** — aproximadamente **4.125 tokens** en la ventana de contexto de un LLM.

## Paso 3: Extracción de Contenido

El HTML crudo es demasiado ruidoso y costoso en tokens para pasarlo directamente al modelo IA. Así que la herramienta aplica un pre-procesamiento:

1. **Elimina etiquetas irrelevantes:** `<script>`, `<style>`, `<nav>`, `<footer>`, píxeles de rastreo
2. **Extrae texto legible:** párrafos, encabezados, listas, tablas
3. **Convierte a markdown** (a veces) para mayor compactación
4. **Trunca** para ajustarse a los límites de tokens

Esta extracción es heurística e imperfecta. La herramienta no sabe qué `<div>` contiene el precio de tu producto y cuál contiene un banner de cookies. Adivina basándose en la estructura HTML — y a menudo adivina mal.

## Paso 4: El Texto Entra en la Ventana de Contexto

El texto limpio llega a la ventana de contexto de la IA como si fuera un mensaje más. El agente no "ve" la página — lee un documento de texto que puede o no representar fielmente lo que un humano vería.

Restricciones clave en este punto:
- **La ventana de contexto es finita.** Un modelo de 128K tokens suena espacioso, pero una sola página web ruidosa puede consumir el 3-5% de ella
- **Sin información visual.** Imágenes, gráficos y layouts son invisibles a menos que se proporcione texto alternativo
- **Sin interacción.** El agente no puede hacer clic en botones, rellenar formularios ni hacer scroll

## Paso 5: El Agente Razona

A partir del texto extraído, el agente intenta responder la pregunta del usuario. Identifica nombres de productos, precios, descripciones y cualquier información estructurada que pueda encontrar.

Si la extracción fue limpia, el agente da una gran respuesta. Si la extracción perdió el precio (porque se renderizaba con JavaScript) o incluyó texto del banner de cookies como si fuera información del producto, la respuesta es incorrecta o incompleta.

## Las Limitaciones Son Estructurales

Este no es un problema de ningún modelo IA en particular. Es un problema estructural de cómo la web sirve contenido:

**Sin ejecución de JavaScript.** Si tu contenido se renderiza del lado del cliente (React, Vue, Angular SPAs), el agente IA ve un `<div id="root"></div>` vacío y nada más. Tu sitio entero es invisible.

**Sin estado ni sesiones.** Cada petición es independiente. El agente no puede iniciar sesión, mantener un carrito de compras ni acceder a contenido restringido.

**Sin navegación con propósito.** El agente no sabe cuál de tus 47 enlaces de navegación lleva a contenido relevante y cuál lleva a tu política de privacidad. Cada enlace es igualmente opaco.

**El truncamiento pierde información.** Cuando una página es muy larga, la herramienta corta contenido — y puede cortar la parte más importante.

## Qué Significa Esto Para Tu Negocio

Si tu sitio web depende del tráfico de IA — y cada vez más, así es — el modelo actual es profundamente ineficiente:

| Qué ocurre | Impacto |
|---|---|
| El agente descarga 181 KB de HTML | Desperdicia tokens en ruido |
| La extracción de contenido falla | Información incorrecta sobre tus productos |
| Contenido renderizado con JavaScript | Completamente invisible para agentes |
| Sin acciones estructuradas | El agente no encuentra tus botones "Comprar" o "Suscribirse" |
| Sin enlaces semánticos | El agente navega a ciegas en vez de con propósito |

La web sirve **un formato para dos audiencias completamente diferentes.** Los navegadores necesitan HTML, CSS y JavaScript. Los agentes IA necesitan texto estructurado, metadatos y acciones declaradas.

## Un Mejor Enfoque

¿Y si tu servidor pudiera detectar que el visitante es un agente IA y responder con exactamente lo que necesita?

Esa es la idea central de la negociación de contenido para IA — y es lo que el [protocolo MAKO](https://makospec.vercel.app/es/docs) hace posible. En lugar de 4.125 tokens de HTML ruidoso, el agente recibe ~276 tokens de markdown estructurado y rico en metadatos. Misma URL, mismo servidor, diferente respuesta.

**¿Quieres ver cómo los agentes IA experimentan tu sitio hoy?** [Comprueba tu MAKO Score](https://makospec.vercel.app/es/score) — una auditoría gratuita de Descubribilidad, Legibilidad, Confiabilidad y Accionabilidad.
