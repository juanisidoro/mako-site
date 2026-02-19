---
title: "Wir stellen vor: MAKO — Das offene Protokoll fuer KI-optimierte Inhalte"
description: "Warum wir MAKO entwickelt haben und wie es den Token-Verbrauch um 94 % senkt und gleichzeitig jede Webseite fuer KI-Agenten verstaendlich macht."
---

# Wir stellen vor: MAKO

Das Web wurde nicht fuer KI-Agenten konzipiert. Jedes Mal, wenn ChatGPT, Perplexity oder ein Shopping-Assistent eine Website besucht, laedt er Navigationsleisten, Cookie-Banner, Werbeskripte und Tausende Zeilen Markup herunter — nur um einen Produktnamen und einen Preis zu finden.

Das Ergebnis? **Ueber 4.000 verbrauchte Tokens**, bevor der Agent den eigentlichen Inhalt erreicht. Bei JavaScript-gerenderten SPAs ist die Lage noch schlimmer: Der Agent sieht ein leeres `<div id="root"></div>` und sonst nichts.

## Das Problem

Nehmen wir eine typische E-Commerce-Produktseite. Ein menschlicher Besucher sieht ein uebersichtliches Layout mit Produktbild, Titel, Preis und einem "In den Warenkorb"-Button. Ein KI-Agent sieht Folgendes:

- 181 KB rohes HTML
- Navigation mit 47 Links
- 3 Cookie-Consent-Skripte
- Inline-CSS fuer ueber 200 Komponenten
- Die eigentlichen Produktdaten irgendwo in der Mitte vergraben

Das sind **93 % Rauschen, 7 % Signal**.

## Was MAKO macht

MAKO fuegt jeder Website eine strukturierte, KI-optimierte Schicht hinzu — ueber standardmaessige HTTP-Content-Negotiation. Wenn ein KI-Agent `Accept: text/mako+markdown` sendet, antwortet der Server mit einem sauberen MAKO-Dokument anstelle von rohem HTML:

```yaml
---
mako: "1.0"
type: product
entity: "Kabellose Kopfhoerer Pro"
tokens: 276
language: de
updated: "2026-02-20T10:00:00Z"
---
```

Dieselbe URL, derselbe Server — nur eine andere Antwort fuer ein anderes Publikum.

## Zentrale Designentscheidungen

**Content-Negotiation statt neuer Endpoints.** Wir haben das `Accept`-Header-Muster gewaehlt, weil es keinerlei URL-Aenderungen erfordert. Jede bestehende Seite kann MAKO ausliefern, ohne doppelte Routen anlegen zu muessen.

**Markdown statt JSON.** LLMs werden mit Markdown trainiert. Ein gut strukturiertes Markdown-Dokument mit YAML-Frontmatter ist token-effizienter und fuer Sprachmodelle natuerlicher lesbar als gleichwertiges JSON.

**10 Inhaltstypen.** Product, Article, Docs, Landing, Listing, Profile, Event, Recipe, FAQ und Custom. Jeder Typ teilt dem Agenten genau mit, welche Struktur ihn erwartet.

**Deklarierte Aktionen.** Statt darauf zu hoffen, dass der Agent Ihren "In den Warenkorb"-Button im HTML findet, deklariert MAKO maschinenlesbare Aktionen mit Endpoints und Parametern.

## Die Zahlen

In unseren Benchmarks ueber mehr als 50 reale Seiten:

| Metrik | Rohes HTML | MAKO |
|--------|------------|------|
| Durchschnittliche Groesse | 181 KB | 3 KB |
| Durchschnittliche Tokens | ~4.125 | ~276 |
| Reduktion | — | **93 %** |

Das ist keine marginale Verbesserung. Es ist der Unterschied zwischen einem Agenten, der 3 Seiten pro Kontextfenster verarbeiten kann, und einem, der 45 schafft.

## Erste Schritte

MAKO ist ab sofort verfuegbar:

- **WordPress:** Installieren Sie das [mako-wp Plugin](https://github.com/juanisidoro/mako-wp) — aktivieren und es funktioniert mit WooCommerce, Yoast und ACF
- **Jeder Stack:** Verwenden Sie [@mako-spec/js](https://www.npmjs.com/package/@mako-spec/js) — TypeScript-SDK mit Express-Middleware
- **Validieren:** Verwenden Sie [@mako-spec/cli](https://www.npmjs.com/package/@mako-spec/cli), um Ihre MAKO-Dateien zu validieren

Das Protokoll ist Open Source unter der Apache-2.0-Lizenz. Die vollstaendige Spezifikation finden Sie unter [makospec.vercel.app/docs](https://makospec.vercel.app/de/docs).

## Wie es weitergeht

Wir arbeiten an MAKO Score — einem Audit-Tool, das misst, wie KI-bereit eine Website in vier Dimensionen ist: Auffindbar, Lesbar, Vertrauenswuerdig und Handlungsfaehig. Pruefen Sie Ihre Website unter [makospec.vercel.app/score](https://makospec.vercel.app/de/score).

Das Web gewinnt ein neues Publikum. MAKO hilft Ihnen, dessen Sprache zu sprechen.
