---
title: "KI-bereite Website Checkliste: 21 Schritte zur Optimierung für KI-Agenten"
description: "Eine praktische Checkliste, um Ihre Website für ChatGPT, Claude, Perplexity und jeden KI-Agenten lesbar, auffindbar und handlungsfähig zu machen."
---

# KI-bereite Website Checkliste

KI-Agenten machen einen wachsenden Anteil Ihres Website-Traffics aus. ChatGPT, Claude, Perplexity, Shopping-Assistenten und Research-Bots besuchen täglich Millionen von Seiten — aber die meisten Websites sind nicht für sie gebaut.

Diese Checkliste umfasst 21 konkrete Schritte, die Sie heute umsetzen können, gegliedert nach den vier entscheidenden Dimensionen: **Auffindbar**, **Lesbar**, **Vertrauenswürdig** und **Handlungsfähig**.

## Auffindbar: Können KI-Agenten Sie Finden?

Wenn Agenten Ihre Inhalte nicht entdecken können, spielt alles andere keine Rolle.

### 1. Erlauben Sie KI-Crawler in der robots.txt

Stellen Sie sicher, dass Ihre `robots.txt` keine KI-Crawler blockiert. Viele Websites blockieren unbeabsichtigt User Agents wie `GPTBot`, `ClaudeBot` oder `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Fügen Sie eine sitemap.xml hinzu

Eine Sitemap hilft Agenten, alle Ihre Seiten zu entdecken, ohne Link für Link crawlen zu müssen. Stellen Sie sicher, dass sie in Ihrer `robots.txt` referenziert ist und alle wichtigen Seiten enthält.

### 3. Fügen Sie eine llms.txt-Datei hinzu

Der [llms.txt-Standard](https://llmstxt.org) teilt KI-Agenten mit, was Ihre Website bietet und wie sie darauf zugreifen können. Betrachten Sie es als `robots.txt` für LLMs — eine Anweisungsdatei auf Website-Ebene. Lesen Sie unseren [Leitfaden zur Erstellung einer effektiven llms.txt](/de/blog/llms-txt-erstellen).

### 4. Fügen Sie strukturierte Daten hinzu (JSON-LD)

Schema.org-Markup im JSON-LD-Format hilft Agenten zu verstehen, worum es auf Ihrer Seite geht, ohne den HTML-Code parsen zu müssen. Fügen Sie mindestens `@type`, `name`, `description` und relevante Eigenschaften für Ihren Inhaltstyp ein.

### 5. Fügen Sie Open Graph Tags hinzu

Open Graph Tags (`og:title`, `og:description`, `og:type`, `og:image`) werden von KI-Agenten zur Vorschau und Klassifizierung von Inhalten verwendet — nicht nur von sozialen Plattformen.

### 6. Fügen Sie WebMCP-Attribute zu Ihren Formularen hinzu

[WebMCP](https://webmachinelearning.github.io/webmcp/) ist ein W3C-Standard, mit dem Sie Ihre Formulare als Tools für KI-Agenten deklarieren können. Fügen Sie die Attribute `toolname` und `tooldescription` zu Ihren `<form>`-Elementen hinzu, damit Agenten sie direkt entdecken und nutzen können — ohne Screen-Scraping. Lesen Sie unseren [WebMCP-Leitfaden](/de/blog/webmcp-implementieren).

## Lesbar: Können KI-Agenten Sie Verstehen?

Die meisten Webseiten bestehen zu über 90% aus überflüssigem Code. Agenten brauchen saubere, strukturierte Inhalte.

### 7. Verwenden Sie semantisches HTML

Tags wie `<main>`, `<article>`, `<section>` und `<aside>` zeigen den Agenten, wo sich der eigentliche Inhalt befindet. Ohne sie sieht der Agent nur eine unstrukturierte Masse aus `<div>`-Elementen.

### 8. Fügen Sie eine einzelne, aussagekräftige H1 hinzu

Die H1 ist das wichtigste Signal, das Agenten nutzen, um den Inhalt einer Seite zu verstehen. Verwenden Sie genau eine, und formulieren Sie sie beschreibend — nicht "Willkommen" oder "Startseite."

### 9. Verwenden Sie aussagekräftige Überschriften

Überschriften (`<h2>`, `<h3>`) sollten den Inhalt des jeweiligen Abschnitts zusammenfassen. Agenten nutzen sie zum schnellen Überfliegen — um die Struktur zu erfassen, ohne alles lesen zu müssen. Vermeiden Sie generische Überschriften wie "Weitere Informationen."

### 10. Fügen Sie Alt-Texte zu Bildern hinzu

Ohne Alt-Text sind Bilder für KI-Agenten unsichtbar. Mit Alt-Text verstehen Agenten Ihren visuellen Inhalt und können ihn in ihren Antworten referenzieren.

### 11. Verwenden Sie beschreibende Linktexte

Ersetzen Sie generische Linktexte ("hier klicken", "mehr lesen", "weitere Infos") durch aussagekräftige Bezeichnungen. Agenten nutzen den Linktext, um zu entscheiden, ob es sich lohnt, einem Link zu folgen.

### 12. Machen Sie sich nicht von JavaScript abhängig für Inhalte

KI-Agenten und Crawler können kein JavaScript ausführen. Wenn Ihr Inhalt clientseitiges Rendering erfordert (React, Vue, Angular SPAs ohne SSR), ist er für jeden KI-Agenten unsichtbar. Verwenden Sie SSR oder statische Generierung.

### 13. Reduzieren Sie unnötigen HTML-Ballast

Entfernen Sie überflüssige Inline-Styles, leere Elemente und nicht-semantisches Markup. Je weniger Rauschen in Ihrem HTML, desto besser ist das Signal-Rausch-Verhältnis für die Agenten.

## Vertrauenswürdig: Können KI-Agenten Ihnen Vertrauen?

Vertrauenssignale helfen Agenten, die Genauigkeit zu überprüfen und zu entscheiden, ob sie Ihre Seite zitieren sollen.

### 14. Fügen Sie eine Meta Description hinzu

Die Meta Description ist die Kurzzusammenfassung, die Agenten verwenden, wenn sie nicht die gesamte Seite lesen. Halten Sie sie unter 160 Zeichen, spezifisch und präzise.

### 15. Setzen Sie eine Canonical URL

`<link rel="canonical">` verhindert, dass Agenten doppelte Versionen Ihres Inhalts indexieren. Unverzichtbar bei URL-Parametern, Paginierung oder Druckversionen.

### 16. Deklarieren Sie die Sprache

Das `lang`-Attribut auf `<html>` teilt Agenten mit, in welcher Sprache Ihr Inhalt verfasst ist. Einfach, aber häufig fehlend — und es beeinflusst direkt das Verständnis.

```html
<html lang="de">
```

### 17. Halten Sie Inhalte aktuell

Agenten achten auf Datumsangaben. Fügen Sie `datePublished` und `dateModified` in Ihre strukturierten Daten ein. Veraltete Inhalte verlieren an Vertrauenswürdigkeit.

### 18. Verwenden Sie ETag- oder Last-Modified-Header

Diese Header ermöglichen es Agenten zu prüfen, ob sich der Inhalt geändert hat, ohne alles erneut herunterladen zu müssen. Effizientes Caching signalisiert eine gut gepflegte Website.

## Handlungsfähig: Können KI-Agenten mit Ihnen Interagieren?

Die Zukunft des Agenten-Webs ist transaktional. Wenn Agenten Ihre Aktionen nicht finden, entgehen Ihnen Conversions.

### 19. Definieren Sie klare CTAs im Inhalt

Ihre Buttons "Jetzt kaufen", "Abonnieren", "Demo buchen" sollten im HTML-Inhalt klar erkennbar sein, nicht nur visuell gestaltet. Agenten identifizieren Aktionen anhand von Text und HTML-Struktur, nicht anhand von CSS.

### 20. Verwenden Sie semantische Links mit Kontext

Links sollten einen beschreibenden Text haben, der erklärt, wohin sie führen. Statt "Hier klicken für Preise" schreiben Sie "Preismodelle ansehen." Das hilft Agenten, gezielt durch Ihre Website zu navigieren.

### 21. Platzieren Sie Ihren Hauptinhalt zuerst

Agenten analysieren die ersten paar hundert Zeichen, um zu entscheiden, ob eine Seite relevant ist. Wenn sie nur Navigation oder überflüssigen Code vor dem eigentlichen Inhalt finden, überspringen sie Ihre Seite möglicherweise komplett. Platzieren Sie Ihre H1 und den Hauptinhalt so weit oben wie möglich im HTML.

## Jenseits der Checkliste: Das MAKO-Level

Alles oben Genannte macht Ihre Website besser für KI-Agenten im bestehenden HTML-Format. Aber es gibt eine Obergrenze — selbst perfekt optimiertes HTML sendet immer noch **15-20x mehr Tokens** als nötig.

Die nächste Stufe ist, strukturierte, KI-native Inhalte neben Ihrem HTML durch Content Negotiation bereitzustellen. Genau das ermöglicht das [MAKO-Protokoll](https://makospec.vercel.app/de/docs): gleiche URL, gleicher Server, aber wenn ein KI-Agent die Seite besucht, erhält er optimiertes Markdown mit Metadaten statt rohem HTML.

Das Ergebnis: **~94% weniger Tokens**, deklarierte Aktionen, die Agenten ausführen können, und semantische Links, denen sie gezielt folgen können.

## Messen Sie, Wo Sie Stehen

Jeder Punkt dieser Checkliste entspricht einer konkreten Prüfung in [MAKO Score](https://makospec.vercel.app/de/score) — einem kostenlosen Audit, das Ihre Website in allen vier Dimensionen (Auffindbar, Lesbar, Vertrauenswürdig, Handlungsfähig) bewertet und eine Punktzahl von 0 bis 100 vergibt.

Die meisten Websites ohne Optimierung erreichen 30-40 Punkte. Mit dieser Checkliste können Sie 60+ erreichen. Mit MAKO 90+.

[Prüfen Sie jetzt Ihren AI Score](https://makospec.vercel.app/de/score).