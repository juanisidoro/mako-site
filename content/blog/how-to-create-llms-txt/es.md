---
title: "Cómo Crear un llms.txt Efectivo para Agentes de IA"
description: "Guía rápida para crear un archivo llms.txt — el robots.txt para agentes IA. Dile a ChatGPT, Claude y Perplexity de qué va tu sitio."
---

# Cómo Crear un llms.txt Efectivo para Agentes de IA

El archivo `llms.txt` es la forma más sencilla de decirle a los agentes IA de qué trata tu sitio web. Piensa en él como el `robots.txt` de los LLMs — un archivo de texto plano en la raíz de tu sitio que describe tu contenido, estructura y capacidades para consumo de IA.

Si un agente no sabe qué ofrece tu sitio, no puede recomendarte. Configurarlo lleva 5 minutos.

## Qué es llms.txt

El [estándar llms.txt](https://llmstxt.org) define un archivo de texto servido en `https://tusitio.com/llms.txt` que proporciona a los agentes IA:

- Una descripción de tu sitio y negocio
- Páginas clave y su propósito
- Estructura del contenido y pistas de navegación
- Endpoints de API o capacidades especiales
- Qué debe y qué no debe hacer el agente

No es una especificación técnica — es una conversación con el agente en lenguaje natural.

## Estructura Básica

Un `llms.txt` mínimo que funciona:

```markdown
# Nombre de Tu Sitio

> Breve descripción de tu sitio (1-2 frases).

## Páginas Principales

- [Inicio](https://tusitio.com): Qué encuentran los visitantes
- [Productos](https://tusitio.com/productos): Tu catálogo de productos
- [Blog](https://tusitio.com/blog): Artículos sobre tu industria
- [Contacto](https://tusitio.com/contacto): Cómo contactarte

## Qué Ofrece Este Sitio

Describe tu propuesta de valor en 2-3 frases.
¿Qué hace tu sitio relevante para alguien que le pregunte a una IA sobre tu tema?
```

## Ejemplo Real

El `llms.txt` de [makospec.vercel.app](https://makospec.vercel.app/llms.txt):

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> Protocolo abierto para servir contenido web optimizado para LLMs.
> Reduce el consumo de tokens en ~93% mediante negociación de contenido.

## Documentación

- [Especificación](https://makospec.vercel.app/es/docs/spec): Spec completa del protocolo
- [Formato CEF](https://makospec.vercel.app/es/docs/cef): Compact Embedding Format
- [Cabeceras HTTP](https://makospec.vercel.app/es/docs/headers): Referencia de headers
- [Ejemplos](https://makospec.vercel.app/es/docs/examples): Producto, artículo, docs

## Herramientas

- [Analizador](https://makospec.vercel.app/es/analyzer): Genera MAKO de cualquier URL
- [Score](https://makospec.vercel.app/es/score): Auditoría de IA-readiness (0-100)
- [Directorio](https://makospec.vercel.app/es/directory): Análisis públicos

## Paquetes

- npm: @mako-spec/js (SDK TypeScript)
- npm: @mako-spec/cli (Herramienta CLI)
- WordPress: plugin mako-wp
```

## Consejos para un llms.txt Efectivo

### Sé específico, no genérico

Mal: "Vendemos cosas online."
Bien: "Plataforma SaaS B2B de gestión de inventario. Más de 2.000 SKUs en electrónica, muebles y material de oficina."

### Incluye tus URLs clave

Los agentes las usan para navegar tu sitio. Lista las 5-10 páginas más importantes.

### Menciona tus capacidades

Si tu sitio tiene API, buscador o funciones especiales, dilo:

```markdown
## API

- POST /api/search: Buscar productos por consulta
- GET /api/products/:id: Obtener detalles del producto en JSON
```

### Actualízalo cuando cambie tu sitio

Un `llms.txt` desactualizado es peor que no tener ninguno. Si añades una sección, categoría o funcionalidad nueva, actualiza el archivo.

### Mantenlo bajo 500 líneas

Es un resumen, no tu sitemap completo. Los agentes tienen límites de contexto.

## Dónde Colocarlo

El archivo debe servirse en la raíz de tu dominio:

```
https://tusitio.com/llms.txt
```

**Sitios estáticos (HTML, Hugo, Astro):** Añade `llms.txt` a tu carpeta `public/` o `static/`.

**Next.js:** Crea `public/llms.txt` o añade un route handler en `app/llms.txt/route.ts`.

**WordPress:** Usa un plugin, añádelo a la raíz de tu tema, o crea una regla de reescritura.

**Nginx/Apache:** Coloca el archivo en el directorio raíz del servidor web.

## llms.txt vs MAKO

Estos dos estándares se complementan:

| | llms.txt | MAKO |
|---|---|---|
| **Alcance** | Nivel de sitio | Nivel de página |
| **Propósito** | Describir qué ofrece tu sitio | Servir contenido optimizado por página |
| **Formato** | Texto plano / markdown | Frontmatter YAML + cuerpo markdown |
| **Ideal para** | Descubrimiento y navegación | Consumo de contenido y acciones |

Usa `llms.txt` para que los agentes encuentren tu contenido. Usa [MAKO](https://makospec.vercel.app/es/docs) para servirlo eficientemente.

## Verifica que Funciona

Después de crear tu `llms.txt`:

1. Visita `https://tusitio.com/llms.txt` en tu navegador — debería mostrarse como texto plano
2. Pasa tu sitio por [MAKO Score](https://makospec.vercel.app/es/score) — el check "Has llms.txt" debería pasar
3. Pregúntale a ChatGPT o Claude: "¿Qué ofrece [tusitio.com]?" — si `llms.txt` está indexado, la respuesta mejora

Cinco minutos de trabajo. Visibilidad permanente ante cada agente IA que visite tu sitio.
