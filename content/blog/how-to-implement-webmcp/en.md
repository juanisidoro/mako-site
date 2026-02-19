---
title: "What Is WebMCP and How to Add It to Your Website"
description: "WebMCP is the new W3C standard that lets AI agents interact with your site through HTML forms. Learn how to implement it with a few attributes."
---

# What Is WebMCP and How to Add It to Your Website

Every time an AI agent wants to buy something, search for a product, or book a table on a website, it has to pretend to be a human. Open a browser, look at the screen, click buttons, guess what each field does.

It works — sort of. But it's slow, fragile, and breaks constantly.

WebMCP fixes this. You add a few HTML attributes to the forms you already have, and AI agents instantly know what your site can do.

## What Is WebMCP?

WebMCP (Web Model Context Protocol) is a [W3C standard](https://webmachinelearning.github.io/webmcp/) backed by Google and Microsoft. It gives websites a way to declare their interactive capabilities so AI agents can use them directly — no screen-scraping, no guessing.

You already have forms: a search bar, a checkout flow, a booking widget. WebMCP lets you label those forms with semantic attributes so agents understand them as structured tools.

It launched in [Chrome 146](https://developer.chrome.com/blog/webmcp-epp) (February 2026) as an early preview. Firefox, Safari, and Edge are part of the [W3C working group](https://webmachinelearning.github.io/webmcp/).

## How It Works: Add Attributes to Your Forms

Here's a product search form without WebMCP:

```html
<form action="/search">
  <input type="text" name="q" placeholder="Search products...">
  <button type="submit">Search</button>
</form>
```

A human sees a search bar. An AI agent sees... an input field. It doesn't know what it searches, what to type, or what happens when it submits.

Now the same form with WebMCP:

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="Search our catalog of 3,000+ products by name, brand, or category"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="Query"
         toolparamdescription="Product name, brand, or category to search for">

  <button type="submit">Search</button>
</form>
```

Three attributes on the form, two on the input. The agent now knows exactly what this tool does and can use it with confidence.

### The Attributes

**On `<form>`:**

| Attribute | Required | Purpose |
|---|---|---|
| `toolname` | Yes | Unique identifier for the tool |
| `tooldescription` | Yes | Plain-language description of what the form does |
| `toolautosubmit` | No | Auto-submit when the agent fills all fields |

**On `<input>`, `<select>`, `<textarea>`:**

| Attribute | Purpose |
|---|---|
| `toolparamtitle` | Short label for the field |
| `toolparamdescription` | What data goes here (helpful when the label isn't obvious) |

## E-Commerce Examples

### Product Search with Filters

```html
<form action="/products"
      toolname="find_products"
      tooldescription="Search products with optional price and category filters">

  <input type="text" name="q"
         toolparamtitle="Search"
         toolparamdescription="Product name or keyword">

  <select name="category"
          toolparamtitle="Category"
          toolparamdescription="Filter by product category">
    <option value="">All categories</option>
    <option value="electronics">Electronics</option>
    <option value="clothing">Clothing</option>
    <option value="home">Home & Garden</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="Max price"
         toolparamdescription="Maximum price in USD">

  <button type="submit">Search</button>
</form>
```

When someone asks an AI assistant _"Find me headphones under $50"_, the agent fills in the query, selects a category, sets the max price, and submits. No DOM guessing required.

### Add to Cart

```html
<form action="/cart/add" method="POST"
      toolname="add_to_cart"
      tooldescription="Add a product to the shopping cart by its SKU and quantity"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="Product SKU identifier">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="Quantity"
         toolparamdescription="Number of units to add">

  <button type="submit">Add to cart</button>
</form>
```

### Check Stock by Zip Code

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="Check if a product is available for pickup at a store near a zip code"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="Zip code"
         toolparamdescription="5-digit US zip code to find nearby stores">

  <button type="submit">Check availability</button>
</form>
```

## The JavaScript API

For dynamic tools that can't be represented as static forms, use the imperative API:

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "Calculate shipping cost and delivery date for a cart",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "Destination zip code"
      },
      method: {
        type: "string",
        description: "Shipping method: standard, express, or overnight"
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

The `navigator.modelContext` API also provides:
- `provideContext()` — Register multiple tools at once
- `unregisterTool(name)` — Remove a specific tool
- `clearContext()` — Remove all registered tools

Full API reference: [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/).

## How to Test It

1. Download [Chrome Canary](https://www.google.com/chrome/canary/)
2. Open `chrome://flags/` and enable **"WebMCP for testing"**
3. Install the WebMCP Chrome extension (uses a free Gemini API key from [Google AI Studio](https://aistudio.google.com))
4. Open any page with WebMCP attributes — the agent can interact with your forms

## Why You Should Do This Now

Adding WebMCP is trivial. Two or three attributes on forms that already exist. No backend changes, no new files, no API to build.

Without these attributes, AI agents will still try to use your site — but through slow, unreliable screen automation. With them, agents interact with your forms like a developer would use your API: directly and precisely.

Early adoption matters. As more agents support WebMCP, the sites that already declare their tools will get the interactions. The ones that don't will get scraped — poorly.

## WebMCP + llms.txt + MAKO

Three standards, three layers:

| Standard | Layer | What it does |
|---|---|---|
| **[llms.txt](/en/blog/how-to-create-llms-txt)** | Discovery | Tells agents what your site is about |
| **WebMCP** | Interaction | Lets agents use your forms and tools |
| **[MAKO](https://makospec.vercel.app/en/docs)** | Content | Serves AI-optimized content per page |

llms.txt is the map. WebMCP is the interface. MAKO is the content. Together, they make your site fully accessible to every AI agent that visits.

## References

- [W3C WebMCP Specification](https://webmachinelearning.github.io/webmcp/)
- [Chrome Blog: WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — Official demos and utilities
