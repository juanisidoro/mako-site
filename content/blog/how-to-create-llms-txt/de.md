---
title: "So Erstellen Sie eine llms.txt, die KI-Agenten Tatsächlich Nutzen"
description: "Kurzanleitung zur Erstellung einer effektiven llms.txt-Datei — die robots.txt für KI-Agenten. Sagen Sie ChatGPT, Claude und Perplexity, worum es auf Ihrer Website geht."
---

# So Erstellen Sie eine llms.txt, die KI-Agenten Tatsächlich Nutzen

Die `llms.txt`-Datei ist der einfachste Weg, KI-Agenten mitzuteilen, worum es auf Ihrer Website geht. Betrachten Sie sie als die `robots.txt` für LLMs — eine einfache Textdatei im Stammverzeichnis Ihrer Website, die Ihren Inhalt, Ihre Struktur und Ihre Funktionen für die KI-Nutzung beschreibt.

Wenn ein Agent nicht weiß, was Ihre Website bietet, kann er Sie nicht empfehlen. Die Einrichtung dauert 5 Minuten.

## Was ist llms.txt?

Der [llms.txt-Standard](https://llmstxt.org) definiert eine Textdatei unter `https://ihreseite.com/llms.txt`, die KI-Agenten folgendes bereitstellt:

- Eine Beschreibung Ihrer Website und Ihres Geschäfts
- Wichtige Seiten und deren Zweck
- Inhaltsstruktur und Navigationshinweise
- API-Endpunkte oder besondere Funktionen
- Was der Agent tun und lassen soll

Es ist keine technische Spezifikation — es ist ein Gespräch mit dem Agenten in natürlicher Sprache.

## Grundstruktur

Eine minimale `llms.txt`, die funktioniert:

```markdown
# Name Ihrer Website

> Kurze Beschreibung Ihrer Website (1-2 Sätze).

## Hauptseiten

- [Startseite](https://ihreseite.com): Was Besucher hier finden
- [Produkte](https://ihreseite.com/produkte): Ihr Produktkatalog
- [Blog](https://ihreseite.com/blog): Artikel über Ihre Branche
- [Kontakt](https://ihreseite.com/kontakt): So erreichen Sie uns

## Was Diese Website Bietet

Beschreiben Sie Ihr Wertversprechen in 2-3 Sätzen.
Was macht Ihre Website relevant für jemanden, der eine KI zu Ihrem Thema befragt?
```

## Praxisbeispiel

Die `llms.txt` von [makospec.vercel.app](https://makospec.vercel.app/llms.txt):

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> Offenes Protokoll zur Bereitstellung von LLM-optimiertem Web-Content.
> Reduziert den Token-Verbrauch um ~93 % durch Content Negotiation.

## Dokumentation

- [Spezifikation](https://makospec.vercel.app/de/docs/spec): Vollständige MAKO-Protokollspezifikation
- [CEF-Format](https://makospec.vercel.app/de/docs/cef): Compact Embedding Format
- [HTTP-Header](https://makospec.vercel.app/de/docs/headers): Header-Referenz
- [Beispiele](https://makospec.vercel.app/de/docs/examples): Produkt, Artikel, Docs

## Tools

- [Analyzer](https://makospec.vercel.app/de/analyzer): MAKO für jede URL generieren
- [Score](https://makospec.vercel.app/de/score): KI-Readiness-Audit (0-100)
- [Verzeichnis](https://makospec.vercel.app/de/directory): Öffentliche Analysen

## Pakete

- npm: @mako-spec/js (TypeScript SDK)
- npm: @mako-spec/cli (CLI-Tool)
- WordPress: mako-wp Plugin
```

## Tipps für eine Effektive llms.txt

### Seien Sie konkret, nicht allgemein

Schlecht: „Wir verkaufen Sachen online."
Gut: „B2B-SaaS-Plattform für Bestandsverwaltung. Über 2.000 SKUs in Elektronik, Möbeln und Bürobedarf."

### Fügen Sie Ihre wichtigsten URLs ein

Agenten nutzen diese, um auf Ihrer Website zu navigieren. Listen Sie die 5-10 wichtigsten Seiten auf.

### Erwähnen Sie Ihre Funktionen

Wenn Ihre Website eine API, eine Suche oder besondere Features hat, geben Sie das an:

```markdown
## API

- POST /api/search: Produkte nach Suchbegriff suchen
- GET /api/products/:id: Produktdetails als JSON abrufen
```

### Aktualisieren Sie die Datei bei Änderungen

Eine veraltete `llms.txt` ist schlimmer als gar keine. Wenn Sie einen neuen Bereich, eine Produktkategorie oder ein Feature hinzufügen, aktualisieren Sie die Datei.

### Halten Sie es unter 500 Zeilen

Das ist eine Zusammenfassung, keine komplette Sitemap. Agenten haben Kontextlimits.

## Wo Sie die Datei Platzieren

Die Datei muss im Stammverzeichnis Ihrer Domain bereitgestellt werden:

```
https://ihreseite.com/llms.txt
```

**Statische Websites (HTML, Hugo, Astro):** Fügen Sie `llms.txt` in Ihren `public/`- oder `static/`-Ordner ein.

**Next.js:** Erstellen Sie `public/llms.txt` oder fügen Sie einen Route Handler unter `app/llms.txt/route.ts` hinzu.

**WordPress:** Verwenden Sie ein Plugin, fügen Sie die Datei ins Theme-Stammverzeichnis ein, oder erstellen Sie eine Rewrite-Regel.

**Nginx/Apache:** Legen Sie die Datei im Web-Root-Verzeichnis ab.

## llms.txt vs MAKO

Diese beiden Standards ergänzen sich:

| | llms.txt | MAKO |
|---|---|---|
| **Umfang** | Website-Ebene | Seiten-Ebene |
| **Zweck** | Beschreiben, was Ihre Website bietet | Optimierten Inhalt pro Seite bereitstellen |
| **Format** | Klartext / Markdown | YAML-Frontmatter + Markdown-Body |
| **Ideal für** | Entdeckung und Navigation | Content-Konsum und Aktionen |

Nutzen Sie `llms.txt`, damit Agenten Ihren Content finden. Nutzen Sie [MAKO](https://makospec.vercel.app/de/docs), um ihn effizient bereitzustellen.

## Überprüfen Sie die Funktion

Nach dem Erstellen Ihrer `llms.txt`:

1. Rufen Sie `https://ihreseite.com/llms.txt` in Ihrem Browser auf — die Datei sollte als Klartext angezeigt werden
2. Prüfen Sie Ihre Website mit [MAKO Score](https://makospec.vercel.app/de/score) — der Check „Has llms.txt" sollte bestanden werden
3. Fragen Sie ChatGPT oder Claude: „Was bietet [ihreseite.com]?" — wenn die `llms.txt` indexiert ist, verbessert sich die Antwort

Fünf Minuten Aufwand. Dauerhafte Sichtbarkeit für jeden KI-Agenten, der Ihre Website besucht.
