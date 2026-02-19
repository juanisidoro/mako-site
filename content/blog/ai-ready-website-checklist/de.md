---
title: "KI-bereite Website Checkliste: 20 Schritte zur Optimierung f\u00fcr KI-Agenten"
description: "Eine praktische Checkliste, um Ihre Website f\u00fcr ChatGPT, Claude, Perplexity und jeden KI-Agenten lesbar, auffindbar und handlungsf\u00e4hig zu machen."
---

# KI-bereite Website Checkliste

KI-Agenten machen einen wachsenden Anteil Ihres Website-Traffics aus. ChatGPT, Claude, Perplexity, Shopping-Assistenten und Research-Bots besuchen t\u00e4glich Millionen von Seiten \u2014 aber die meisten Websites sind nicht f\u00fcr sie gebaut.

Diese Checkliste umfasst 20 konkrete Schritte, die Sie heute umsetzen k\u00f6nnen, gegliedert nach den vier entscheidenden Dimensionen: **Auffindbar**, **Lesbar**, **Vertrauensw\u00fcrdig** und **Handlungsf\u00e4hig**.

## Auffindbar: K\u00f6nnen KI-Agenten Sie Finden?

Wenn Agenten Ihre Inhalte nicht entdecken k\u00f6nnen, spielt alles andere keine Rolle.

### 1. Erlauben Sie KI-Crawler in der robots.txt

Stellen Sie sicher, dass Ihre `robots.txt` keine KI-Crawler blockiert. Viele Websites blockieren unbeabsichtigt User Agents wie `GPTBot`, `ClaudeBot` oder `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. F\u00fcgen Sie eine sitemap.xml hinzu

Eine Sitemap hilft Agenten, alle Ihre Seiten zu entdecken, ohne Link f\u00fcr Link crawlen zu m\u00fcssen. Stellen Sie sicher, dass sie in Ihrer `robots.txt` referenziert ist und alle wichtigen Seiten enth\u00e4lt.

### 3. F\u00fcgen Sie eine llms.txt-Datei hinzu

Der [llms.txt-Standard](https://llmstxt.org) teilt KI-Agenten mit, was Ihre Website bietet und wie sie darauf zugreifen k\u00f6nnen. Betrachten Sie es als `robots.txt` f\u00fcr LLMs \u2014 eine Anweisungsdatei auf Website-Ebene.

### 4. F\u00fcgen Sie strukturierte Daten hinzu (JSON-LD)

Schema.org-Markup im JSON-LD-Format hilft Agenten zu verstehen, worum es auf Ihrer Seite geht, ohne den HTML-Code parsen zu m\u00fcssen. F\u00fcgen Sie mindestens `@type`, `name`, `description` und relevante Eigenschaften f\u00fcr Ihren Inhaltstyp ein.

### 5. F\u00fcgen Sie Open Graph Tags hinzu

Open Graph Tags (`og:title`, `og:description`, `og:type`, `og:image`) werden von KI-Agenten zur Vorschau und Klassifizierung von Inhalten verwendet \u2014 nicht nur von sozialen Plattformen.

## Lesbar: K\u00f6nnen KI-Agenten Sie Verstehen?

Die meisten Webseiten bestehen zu \u00fcber 90% aus \u00fcberfl\u00fcssigem Code. Agenten brauchen saubere, strukturierte Inhalte.

### 6. Verwenden Sie semantisches HTML

Tags wie `<main>`, `<article>`, `<section>` und `<aside>` zeigen den Agenten, wo sich der eigentliche Inhalt befindet. Ohne sie sieht der Agent nur eine unstrukturierte Masse aus `<div>`-Elementen.

### 7. F\u00fcgen Sie eine einzelne, aussagekr\u00e4ftige H1 hinzu

Die H1 ist das wichtigste Signal, das Agenten nutzen, um den Inhalt einer Seite zu verstehen. Verwenden Sie genau eine, und formulieren Sie sie beschreibend \u2014 nicht "Willkommen" oder "Startseite."

### 8. Verwenden Sie aussagekr\u00e4ftige \u00dcberschriften

\u00dcberschriften (`<h2>`, `<h3>`) sollten den Inhalt des jeweiligen Abschnitts zusammenfassen. Agenten nutzen sie zum schnellen \u00dcberfliegen \u2014 um die Struktur zu erfassen, ohne alles lesen zu m\u00fcssen. Vermeiden Sie generische \u00dcberschriften wie "Weitere Informationen."

### 9. F\u00fcgen Sie Alt-Texte zu Bildern hinzu

Ohne Alt-Text sind Bilder f\u00fcr KI-Agenten unsichtbar. Mit Alt-Text verstehen Agenten Ihren visuellen Inhalt und k\u00f6nnen ihn in ihren Antworten referenzieren.

### 10. Verwenden Sie beschreibende Linktexte

Ersetzen Sie generische Linktexte ("hier klicken", "mehr lesen", "weitere Infos") durch aussagekr\u00e4ftige Bezeichnungen. Agenten nutzen den Linktext, um zu entscheiden, ob es sich lohnt, einem Link zu folgen.

### 11. Machen Sie sich nicht von JavaScript abh\u00e4ngig f\u00fcr Inhalte

KI-Agenten und Crawler k\u00f6nnen kein JavaScript ausf\u00fchren. Wenn Ihr Inhalt clientseitiges Rendering erfordert (React, Vue, Angular SPAs ohne SSR), ist er f\u00fcr jeden KI-Agenten unsichtbar. Verwenden Sie SSR oder statische Generierung.

### 12. Reduzieren Sie unn\u00f6tigen HTML-Ballast

Entfernen Sie \u00fcberfl\u00fcssige Inline-Styles, leere Elemente und nicht-semantisches Markup. Je weniger Rauschen in Ihrem HTML, desto besser ist das Signal-Rausch-Verh\u00e4ltnis f\u00fcr die Agenten.

## Vertrauensw\u00fcrdig: K\u00f6nnen KI-Agenten Ihnen Vertrauen?

Vertrauenssignale helfen Agenten, die Genauigkeit zu \u00fcberpr\u00fcfen und zu entscheiden, ob sie Ihre Seite zitieren sollen.

### 13. F\u00fcgen Sie eine Meta Description hinzu

Die Meta Description ist die Kurzzusammenfassung, die Agenten verwenden, wenn sie nicht die gesamte Seite lesen. Halten Sie sie unter 160 Zeichen, spezifisch und pr\u00e4zise.

### 14. Setzen Sie eine Canonical URL

`<link rel="canonical">` verhindert, dass Agenten doppelte Versionen Ihres Inhalts indexieren. Unverzichtbar bei URL-Parametern, Paginierung oder Druckversionen.

### 15. Deklarieren Sie die Sprache

Das `lang`-Attribut auf `<html>` teilt Agenten mit, in welcher Sprache Ihr Inhalt verfasst ist. Einfach, aber h\u00e4ufig fehlend \u2014 und es beeinflusst direkt das Verst\u00e4ndnis.

```html
<html lang="de">
```

### 16. Halten Sie Inhalte aktuell

Agenten achten auf Datumsangaben. F\u00fcgen Sie `datePublished` und `dateModified` in Ihre strukturierten Daten ein. Veraltete Inhalte verlieren an Vertrauensw\u00fcrdigkeit.

### 17. Verwenden Sie ETag- oder Last-Modified-Header

Diese Header erm\u00f6glichen es Agenten zu pr\u00fcfen, ob sich der Inhalt ge\u00e4ndert hat, ohne alles erneut herunterladen zu m\u00fcssen. Effizientes Caching signalisiert eine gut gepflegte Website.

## Handlungsf\u00e4hig: K\u00f6nnen KI-Agenten mit Ihnen Interagieren?

Die Zukunft des Agenten-Webs ist transaktional. Wenn Agenten Ihre Aktionen nicht finden, entgehen Ihnen Conversions.

### 18. Definieren Sie klare CTAs im Inhalt

Ihre Buttons "Jetzt kaufen", "Abonnieren", "Demo buchen" sollten im HTML-Inhalt klar erkennbar sein, nicht nur visuell gestaltet. Agenten identifizieren Aktionen anhand von Text und HTML-Struktur, nicht anhand von CSS.

### 19. Verwenden Sie semantische Links mit Kontext

Links sollten einen beschreibenden Text haben, der erkl\u00e4rt, wohin sie f\u00fchren. Statt "Hier klicken f\u00fcr Preise" schreiben Sie "Preismodelle ansehen." Das hilft Agenten, gezielt durch Ihre Website zu navigieren.

### 20. Platzieren Sie Ihren Hauptinhalt zuerst

Agenten analysieren die ersten paar hundert Zeichen, um zu entscheiden, ob eine Seite relevant ist. Wenn sie nur Navigation oder \u00fcberfl\u00fcssigen Code vor dem eigentlichen Inhalt finden, \u00fcberspringen sie Ihre Seite m\u00f6glicherweise komplett. Platzieren Sie Ihre H1 und den Hauptinhalt so weit oben wie m\u00f6glich im HTML.

## Jenseits der Checkliste: Das MAKO-Level

Alles oben Genannte macht Ihre Website besser f\u00fcr KI-Agenten im bestehenden HTML-Format. Aber es gibt eine Obergrenze \u2014 selbst perfekt optimiertes HTML sendet immer noch **15-20x mehr Tokens** als n\u00f6tig.

Die n\u00e4chste Stufe ist, strukturierte, KI-native Inhalte neben Ihrem HTML durch Content Negotiation bereitzustellen. Genau das erm\u00f6glicht das [MAKO-Protokoll](https://makospec.vercel.app/de/docs): gleiche URL, gleicher Server, aber wenn ein KI-Agent die Seite besucht, erh\u00e4lt er optimiertes Markdown mit Metadaten statt rohem HTML.

Das Ergebnis: **~94% weniger Tokens**, deklarierte Aktionen, die Agenten ausf\u00fchren k\u00f6nnen, und semantische Links, denen sie gezielt folgen k\u00f6nnen.

## Messen Sie, Wo Sie Stehen

Jeder Punkt dieser Checkliste entspricht einer konkreten Pr\u00fcfung in [MAKO Score](https://makospec.vercel.app/de/score) \u2014 einem kostenlosen Audit, das Ihre Website in allen vier Dimensionen (Auffindbar, Lesbar, Vertrauensw\u00fcrdig, Handlungsf\u00e4hig) bewertet und eine Punktzahl von 0 bis 100 vergibt.

Die meisten Websites ohne Optimierung erreichen 30-40 Punkte. Mit dieser Checkliste k\u00f6nnen Sie 60+ erreichen. Mit MAKO 90+.

[Pr\u00fcfen Sie jetzt Ihren AI Score](https://makospec.vercel.app/de/score).
