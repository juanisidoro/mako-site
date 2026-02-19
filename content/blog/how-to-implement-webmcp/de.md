---
title: "Was Ist WebMCP und Wie Sie Es Auf Ihrer Website Einrichten"
description: "WebMCP ist der neue W3C-Standard, der KI-Agenten die Interaktion mit Ihrer Website über HTML-Formulare ermöglicht. Erfahren Sie, wie Sie es mit wenigen Attributen implementieren."
---

# Was Ist WebMCP und Wie Sie Es Auf Ihrer Website Einrichten

Jedes Mal, wenn ein KI-Agent etwas kaufen, ein Produkt suchen oder einen Tisch auf einer Website reservieren will, muss er so tun, als wäre er ein Mensch. Einen Browser öffnen, auf den Bildschirm schauen, auf Buttons klicken, erraten, was jedes Feld bedeutet.

Es funktioniert — irgendwie. Aber es ist langsam, fragil und bricht ständig zusammen.

WebMCP löst dieses Problem. Sie fügen ein paar HTML-Attribute zu den Formularen hinzu, die Sie bereits haben, und KI-Agenten wissen sofort, was Ihre Website kann.

## Was Ist WebMCP

WebMCP (Web Model Context Protocol) ist ein [W3C-Standard](https://webmachinelearning.github.io/webmcp/), unterstützt von Google und Microsoft. Er ermöglicht es Websites, ihre interaktiven Fähigkeiten zu deklarieren, damit KI-Agenten sie direkt nutzen können — kein Screen-Scraping, kein Raten.

Sie haben bereits Formulare: eine Suchleiste, einen Checkout-Ablauf, ein Buchungs-Widget. WebMCP ermöglicht es Ihnen, diese Formulare mit semantischen Attributen zu versehen, damit Agenten sie als strukturierte Tools verstehen.

Es wurde in [Chrome 146](https://developer.chrome.com/blog/webmcp-epp) (Februar 2026) als Early Preview eingeführt. Firefox, Safari und Edge sind Teil der [W3C-Arbeitsgruppe](https://webmachinelearning.github.io/webmcp/).

## So Funktioniert Es: Attribute zu Ihren Formularen Hinzufügen

Hier ist ein Produktsuchformular ohne WebMCP:

```html
<form action="/search">
  <input type="text" name="q" placeholder="Produkte suchen...">
  <button type="submit">Suchen</button>
</form>
```

Ein Mensch sieht eine Suchleiste. Ein KI-Agent sieht... ein Eingabefeld. Er weiß nicht, was es sucht, was er eingeben soll oder was passiert, wenn er absendet.

Jetzt dasselbe Formular mit WebMCP:

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="Durchsuchen Sie unseren Katalog mit über 3.000 Produkten nach Name, Marke oder Kategorie"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="Suchanfrage"
         toolparamdescription="Produktname, Marke oder Kategorie zum Suchen">

  <button type="submit">Suchen</button>
</form>
```

Drei Attribute auf dem Formular, zwei auf dem Input. Der Agent weiß jetzt genau, was dieses Tool tut, und kann es mit Zuversicht nutzen.

### Die Attribute

**Auf `<form>`:**

| Attribut | Erforderlich | Funktion |
|---|---|---|
| `toolname` | Ja | Eindeutiger Bezeichner für das Tool |
| `tooldescription` | Ja | Beschreibung in natürlicher Sprache, was das Formular tut |
| `toolautosubmit` | Nein | Automatisch absenden, wenn der Agent alle Felder ausgefüllt hat |

**Auf `<input>`, `<select>`, `<textarea>`:**

| Attribut | Funktion |
|---|---|
| `toolparamtitle` | Kurzes Label für das Feld |
| `toolparamdescription` | Welche Daten hierhin gehören (hilfreich, wenn das Label nicht eindeutig ist) |

## E-Commerce-Beispiele

### Produktsuche mit Filtern

```html
<form action="/produkte"
      toolname="find_products"
      tooldescription="Produkte suchen mit optionalen Preis- und Kategoriefiltern">

  <input type="text" name="q"
         toolparamtitle="Suche"
         toolparamdescription="Produktname oder Stichwort">

  <select name="category"
          toolparamtitle="Kategorie"
          toolparamdescription="Nach Produktkategorie filtern">
    <option value="">Alle Kategorien</option>
    <option value="electronics">Elektronik</option>
    <option value="clothing">Kleidung</option>
    <option value="home">Haus und Garten</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="Maximalpreis"
         toolparamdescription="Maximalpreis in EUR">

  <button type="submit">Suchen</button>
</form>
```

Wenn jemand einen KI-Assistenten fragt _"Finde mir Kopfhörer unter 50 EUR"_, füllt der Agent die Suche aus, wählt die Kategorie, setzt den Maximalpreis und sendet ab. Kein DOM-Raten nötig.

### In den Warenkorb Legen

```html
<form action="/warenkorb/add" method="POST"
      toolname="add_to_cart"
      tooldescription="Ein Produkt anhand seiner SKU und Menge zum Warenkorb hinzufügen"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="SKU-Kennung des Produkts">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="Menge"
         toolparamdescription="Anzahl der hinzuzufügenden Einheiten">

  <button type="submit">In den Warenkorb</button>
</form>
```

### Verfügbarkeit nach Postleitzahl Prüfen

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="Prüfen, ob ein Produkt zur Abholung in einem Geschäft in der Nähe einer Postleitzahl verfügbar ist"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="Postleitzahl"
         toolparamdescription="5-stellige Postleitzahl, um nahegelegene Geschäfte zu finden">

  <button type="submit">Verfügbarkeit prüfen</button>
</form>
```

## Die JavaScript-API

Für dynamische Tools, die nicht als statische Formulare dargestellt werden können, verwenden Sie die imperative API:

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "Versandkosten und Lieferdatum für einen Warenkorb berechnen",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "Ziel-Postleitzahl"
      },
      method: {
        type: "string",
        description: "Versandart: standard, express oder overnight"
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

Die `navigator.modelContext`-API bietet außerdem:
- `provideContext()` — Mehrere Tools auf einmal registrieren
- `unregisterTool(name)` — Ein bestimmtes Tool entfernen
- `clearContext()` — Alle registrierten Tools entfernen

Vollständige Referenz: [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/).

## So Testen Sie Es

1. Laden Sie [Chrome Canary](https://www.google.com/chrome/canary/) herunter
2. Öffnen Sie `chrome://flags/` und aktivieren Sie **"WebMCP for testing"**
3. Installieren Sie die WebMCP Chrome-Erweiterung (nutzt einen kostenlosen Gemini-API-Schlüssel von [Google AI Studio](https://aistudio.google.com))
4. Öffnen Sie eine beliebige Seite mit WebMCP-Attributen — der Agent kann mit Ihren Formularen interagieren

## Warum Sie Es Jetzt Tun Sollten

WebMCP hinzuzufügen ist trivial. Zwei oder drei Attribute auf Formularen, die bereits existieren. Keine Backend-Änderungen, keine neuen Dateien, keine API zu bauen.

Ohne diese Attribute werden KI-Agenten weiterhin versuchen, Ihre Website zu nutzen — aber durch langsame, unzuverlässige Bildschirmautomatisierung. Mit ihnen interagieren Agenten mit Ihren Formularen wie ein Entwickler Ihre API nutzen würde: direkt und präzise.

Frühe Adoption zählt. Je mehr Agenten WebMCP unterstützen, desto mehr Interaktionen erhalten die Websites, die ihre Tools bereits deklariert haben. Die anderen werden gescraped — schlecht.

## WebMCP + llms.txt + MAKO

Drei Standards, drei Schichten:

| Standard | Schicht | Was es tut |
|---|---|---|
| **[llms.txt](/de/blog/llms-txt-erstellen)** | Entdeckung | Sagt Agenten, worum es auf Ihrer Website geht |
| **WebMCP** | Interaktion | Ermöglicht Agenten, Ihre Formulare und Tools zu nutzen |
| **[MAKO](https://makospec.vercel.app/de/docs)** | Inhalt | Liefert KI-optimierten Inhalt pro Seite |

llms.txt ist die Karte. WebMCP ist die Schnittstelle. MAKO ist der Inhalt. Zusammen machen sie Ihre Website für jeden KI-Agenten, der sie besucht, vollständig zugänglich.

## Referenzen

- [W3C WebMCP-Spezifikation](https://webmachinelearning.github.io/webmcp/)
- [Chrome Blog: WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — Offizielle Demos und Werkzeuge
