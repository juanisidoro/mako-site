---
title: "Was Passiert, Wenn ein KI-Agent Ihre Website Besucht"
description: "Die unsichtbare Reise vom HTTP-Request bis zum Reasoning — und warum 93 % dessen, was Ihr Server sendet, Rauschen ist, mit dem ein KI-Agent nichts anfangen kann."
---

# Was Passiert, Wenn ein KI-Agent Ihre Website Besucht

Jeden Tag besuchen Millionen von KI-Agenten Websites. ChatGPT, Claude, Perplexity, Shopping-Assistenten, Recherche-Bots — sie alle muessen Webinhalte lesen. Aber keiner von ihnen sieht Ihre Website so, wie ein Mensch es tun wuerde.

Kein CSS. Keine gerenderten Layouts. Keine Bilder (meistens). Nur Rohtext, extrahiert aus Ihrem HTML-Quellcode.

Hier ist, was tatsaechlich passiert — Schritt fuer Schritt.

## Schritt 1: Der Agent Erhaelt eine URL

Ein Nutzer fragt etwas wie "Vergleiche die Preise fuer kabellose Kopfhoerer in diesem Shop." Der KI-Agent identifiziert die relevante URL und bereitet den Abruf vor.

Der Agent selbst verfuegt ueber keinen Browser. Er delegiert an ein Tool — typischerweise einen HTTP-Client oder einen spezialisierten Web-Abrufdienst — das die Anfrage in seinem Auftrag stellt.

## Schritt 2: Ein HTTP-Request Wird Gesendet

Das Tool sendet einen Standard-`GET`-Request an Ihren Server. Ihr Server weiss nicht (und es kuemmert ihn auch nicht), dass der Besucher ein KI-Agent ist — er antwortet mit demselben HTML, das er an jeden Browser senden wuerde.

Die Antwort umfasst typischerweise:
- Navigationsleisten und Menues (47+ Links)
- Cookie-Consent-Banner und Skripte
- CSS-Stylesheets (inline und extern)
- JavaScript-Bundles
- Werbeskripte und Tracking-Pixel
- Den eigentlichen Inhalt, irgendwo in der Mitte vergraben

Fuer eine typische E-Commerce-Produktseite bedeutet das **181 KB HTML** — rund **4.125 Tokens** im Kontextfenster eines LLM.

## Schritt 3: Inhaltsextraktion

Das rohe HTML ist viel zu verrauscht und token-intensiv, um es direkt an das KI-Modell zu uebergeben. Deshalb fuehrt das Abruf-Tool einen Vorverarbeitungsschritt durch:

1. **Irrelevante Tags entfernen:** `<script>`, `<style>`, `<nav>`, `<footer>`, Tracking-Pixel
2. **Lesbaren Text extrahieren:** Absaetze, Ueberschriften, Listen, Tabellen
3. **In Markdown konvertieren** (manchmal) fuer mehr Kompaktheit
4. **Kuerzen**, um Token-Limits einzuhalten

Diese Extraktion ist heuristisch und unvollkommen. Das Tool weiss nicht, welches `<div>` Ihren Produktpreis enthaelt und welches ein Cookie-Banner ist. Es raet anhand der HTML-Struktur — und liegt oft falsch.

## Schritt 4: Der Text Gelangt ins Kontextfenster

Der bereinigte Text kommt im Kontextfenster der KI an, als waere er eine ganz normale Nachricht. Der Agent "sieht" die Seite nicht — er liest ein Textdokument, das das, was ein Mensch sehen wuerde, mehr oder weniger genau wiedergeben kann.

Wichtige Einschraenkungen an diesem Punkt:
- **Das Kontextfenster ist endlich.** Ein 128K-Token-Modell klingt grosszuegig, aber eine einzige verrauschte Webseite kann 3-5 % davon verbrauchen
- **Keine visuellen Informationen.** Bilder, Diagramme und Layouts sind unsichtbar, es sei denn, Alt-Texte sind vorhanden
- **Keine Interaktion.** Der Agent kann keine Buttons klicken, keine Formulare ausfuellen und nicht scrollen

## Schritt 5: Der Agent Denkt Nach

Aus dem extrahierten Text versucht der Agent, die Frage des Nutzers zu beantworten. Er identifiziert Produktnamen, Preise, Beschreibungen und alle strukturierten Informationen, die er finden kann.

War die Extraktion sauber, liefert der Agent eine hervorragende Antwort. Hat die Extraktion den Preis uebersehen (weil er per JavaScript gerendert wurde) oder Cookie-Banner-Text als Produktinformation einbezogen, ist die Antwort falsch oder unvollstaendig.

## Die Grenzen Sind Struktureller Natur

Das ist kein Problem eines bestimmten KI-Modells. Es ist ein strukturelles Problem der Art und Weise, wie das Web Inhalte ausliefert:

**Keine JavaScript-Ausfuehrung.** Wenn Ihre Inhalte clientseitig gerendert werden (React, Vue, Angular SPAs), sieht der KI-Agent ein leeres `<div id="root"></div>` und sonst nichts. Ihre gesamte Website ist unsichtbar.

**Kein Zustand oder Sessions.** Jede Anfrage ist unabhaengig. Der Agent kann sich nicht einloggen, keinen Warenkorb fuehren und keinen geschuetzten Inhalt abrufen.

**Keine zielgerichtete Navigation.** Der Agent weiss nicht, welcher Ihrer 47 Navigationslinks zu relevantem Inhalt fuehrt und welcher zu Ihrer Datenschutzerklaerung. Jeder Link ist gleich undurchsichtig.

**Kuerzung ist verlustbehaftet.** Wenn eine Seite zu lang ist, schneidet das Tool Inhalte ab — und es kann genau den wichtigsten Teil abschneiden.

## Was Das Fuer Ihr Unternehmen Bedeutet

Wenn Ihre Website auf KI-Traffic angewiesen ist — und das ist zunehmend der Fall — ist das aktuelle Modell zutiefst ineffizient:

| Was passiert | Auswirkung |
|---|---|
| Agent laedt 181 KB HTML herunter | Verschwendet Tokens fuer Rauschen |
| Inhaltsextraktion liegt falsch | Ungenaue Informationen ueber Ihre Produkte |
| Per JavaScript gerenderter Inhalt | Fuer Agenten komplett unsichtbar |
| Keine strukturierten Aktionen | Agent findet Ihre "Kaufen"- oder "Abonnieren"-Buttons nicht |
| Keine semantischen Links | Agent navigiert blind statt zielgerichtet |

Das Web liefert **ein einziges Format fuer zwei voellig unterschiedliche Zielgruppen.** Browser brauchen HTML, CSS und JavaScript. KI-Agenten brauchen strukturierten Text, Metadaten und deklarierte Aktionen.

## Ein Besserer Ansatz

Was waere, wenn Ihr Server erkennen koennte, dass der Besucher ein KI-Agent ist, und genau das zurueckliefert, was dieser braucht?

Das ist die Kernidee hinter Content Negotiation fuer KI — und genau das ermoeglicht das [MAKO-Protokoll](https://makospec.vercel.app/de/docs). Statt 4.125 Tokens verrauschtem HTML erhaelt der Agent ca. 276 Tokens strukturiertes, metadatenreiches Markdown. Gleiche URL, gleicher Server, andere Antwort.

**Moechten Sie sehen, wie KI-Agenten Ihre Website heute erleben?** [Pruefen Sie Ihren MAKO Score](https://makospec.vercel.app/de/score) — ein kostenloses Audit ueber Auffindbarkeit, Lesbarkeit, Vertrauenswuerdigkeit und Handlungsfaehigkeit.
