---
title: "Qué Es WebMCP y Cómo Añadirlo a Tu Web"
description: "WebMCP es el nuevo estándar W3C que permite a los agentes IA interactuar con tu sitio a través de formularios HTML. Aprende a implementarlo con unos pocos atributos."
---

# Qué Es WebMCP y Cómo Añadirlo a Tu Web

Cada vez que un agente de IA quiere comprar algo, buscar un producto o reservar una mesa en un sitio web, tiene que fingir ser humano. Abrir un navegador, mirar la pantalla, hacer clic en botones, adivinar qué hace cada campo.

Funciona — más o menos. Pero es lento, frágil, y se rompe constantemente.

WebMCP cambia esto. Añades unos pocos atributos HTML a los formularios que ya tienes, y los agentes IA saben al instante qué puede hacer tu sitio.

## Qué es WebMCP

WebMCP (Web Model Context Protocol) es un [estándar del W3C](https://webmachinelearning.github.io/webmcp/) respaldado por Google y Microsoft. Permite a los sitios web declarar sus capacidades interactivas para que los agentes IA las utilicen directamente — sin scraping de pantalla, sin adivinanzas.

Ya tienes formularios: una barra de búsqueda, un flujo de checkout, un widget de reservas. WebMCP te permite etiquetar esos formularios con atributos semánticos para que los agentes los entiendan como herramientas estructuradas.

Se lanzó en [Chrome 146](https://developer.chrome.com/blog/webmcp-epp) (febrero 2026) como early preview. Firefox, Safari y Edge participan en el [grupo de trabajo del W3C](https://webmachinelearning.github.io/webmcp/).

## Cómo Funciona: Añade Atributos a Tus Formularios

Este es un formulario de búsqueda de productos sin WebMCP:

```html
<form action="/search">
  <input type="text" name="q" placeholder="Buscar productos...">
  <button type="submit">Buscar</button>
</form>
```

Un humano ve un buscador. Un agente IA ve... un campo de texto. No sabe qué busca, qué escribir, ni qué pasa al enviar.

Ahora el mismo formulario con WebMCP:

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="Buscar en nuestro catálogo de más de 3.000 productos por nombre, marca o categoría"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="Consulta"
         toolparamdescription="Nombre del producto, marca o categoría a buscar">

  <button type="submit">Buscar</button>
</form>
```

Tres atributos en el formulario, dos en el input. El agente ahora sabe exactamente qué hace esta herramienta y puede usarla con total confianza.

### Los Atributos

**En `<form>`:**

| Atributo | Requerido | Función |
|---|---|---|
| `toolname` | Sí | Identificador único de la herramienta |
| `tooldescription` | Sí | Descripción en lenguaje natural de lo que hace el formulario |
| `toolautosubmit` | No | Enviar automáticamente cuando el agente completa los campos |

**En `<input>`, `<select>`, `<textarea>`:**

| Atributo | Función |
|---|---|
| `toolparamtitle` | Etiqueta corta para el campo |
| `toolparamdescription` | Qué dato va aquí (útil cuando la etiqueta no es obvia) |

## Ejemplos para E-Commerce

### Búsqueda de Productos con Filtros

```html
<form action="/productos"
      toolname="find_products"
      tooldescription="Buscar productos con filtros opcionales de precio y categoría">

  <input type="text" name="q"
         toolparamtitle="Búsqueda"
         toolparamdescription="Nombre o palabra clave del producto">

  <select name="category"
          toolparamtitle="Categoría"
          toolparamdescription="Filtrar por categoría de producto">
    <option value="">Todas las categorías</option>
    <option value="electronics">Electrónica</option>
    <option value="clothing">Ropa</option>
    <option value="home">Hogar y Jardín</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="Precio máximo"
         toolparamdescription="Precio máximo en EUR">

  <button type="submit">Buscar</button>
</form>
```

Cuando alguien le pide a un asistente IA _"Encuéntrame auriculares por menos de 50€"_, el agente rellena la consulta, selecciona la categoría, establece el precio máximo y envía. Sin adivinar el DOM.

### Añadir al Carrito

```html
<form action="/carrito/add" method="POST"
      toolname="add_to_cart"
      tooldescription="Añadir un producto al carrito de compra por su SKU y cantidad"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="Identificador SKU del producto">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="Cantidad"
         toolparamdescription="Número de unidades a añadir">

  <button type="submit">Añadir al carrito</button>
</form>
```

### Comprobar Stock por Código Postal

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="Comprobar si un producto está disponible para recogida en una tienda cercana a un código postal"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="Código postal"
         toolparamdescription="Código postal de 5 dígitos para buscar tiendas cercanas">

  <button type="submit">Comprobar disponibilidad</button>
</form>
```

## La API JavaScript

Para herramientas dinámicas que no se pueden representar como formularios estáticos, usa la API imperativa:

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "Calcular el coste de envío y fecha de entrega para un carrito",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "Código postal de destino"
      },
      method: {
        type: "string",
        description: "Método de envío: standard, express u overnight"
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

La API `navigator.modelContext` también ofrece:
- `provideContext()` — Registrar varias herramientas a la vez
- `unregisterTool(name)` — Eliminar una herramienta específica
- `clearContext()` — Eliminar todas las herramientas registradas

Referencia completa: [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/).

## Cómo Probarlo

1. Descarga [Chrome Canary](https://www.google.com/chrome/canary/)
2. Ve a `chrome://flags/` y activa **"WebMCP for testing"**
3. Instala la extensión WebMCP de Chrome (usa una API key gratuita de Gemini desde [Google AI Studio](https://aistudio.google.com))
4. Abre cualquier página con atributos WebMCP — el agente puede interactuar con tus formularios

## Por Qué Hacerlo Ahora

Añadir WebMCP es trivial. Dos o tres atributos en formularios que ya existen. Sin cambios en el backend, sin archivos nuevos, sin APIs que construir.

Sin estos atributos, los agentes IA seguirán intentando usar tu sitio — pero mediante automatización de pantalla lenta y poco fiable. Con ellos, los agentes interactúan con tus formularios como un desarrollador usaría tu API: directa y precisamente.

La adopción temprana importa. A medida que más agentes soporten WebMCP, los sitios que ya declaran sus herramientas recibirán las interacciones. Los que no, serán scrapeados — mal.

## WebMCP + llms.txt + MAKO

Tres estándares, tres capas:

| Estándar | Capa | Qué hace |
|---|---|---|
| **[llms.txt](/es/blog/como-crear-llms-txt)** | Descubrimiento | Dice a los agentes de qué va tu sitio |
| **WebMCP** | Interacción | Permite a los agentes usar tus formularios y herramientas |
| **[MAKO](https://makospec.vercel.app/es/docs)** | Contenido | Sirve contenido optimizado para IA por página |

llms.txt es el mapa. WebMCP es la interfaz. MAKO es el contenido. Juntos, hacen que tu sitio sea totalmente accesible para cada agente IA que lo visite.

## Referencias

- [Especificación W3C WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Chrome Blog: WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — Demos y utilidades oficiales
