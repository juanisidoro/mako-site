---
title: "Checklist Site Web Pr\u00eat pour l'IA : 20 \u00c9tapes pour Optimiser pour les Agents IA"
description: "Une checklist pratique pour rendre votre site lisible, d\u00e9couvrable et exploitable par ChatGPT, Claude, Perplexity et tout agent IA."
---

# Checklist Site Web Pr\u00eat pour l'IA

Les agents IA repr\u00e9sentent une part croissante du trafic de votre site web. ChatGPT, Claude, Perplexity, les assistants d'achat et les bots de recherche visitent des millions de pages chaque jour \u2014 mais la plupart des sites ne sont pas con\u00e7us pour eux.

Cette checklist couvre 20 \u00e9tapes concr\u00e8tes que vous pouvez mettre en \u0153uvre d\u00e8s aujourd'hui, organis\u00e9es selon les quatre dimensions essentielles : **D\u00e9couvrable**, **Lisible**, **Fiable** et **Exploitable**.

## D\u00e9couvrable : Les Agents IA Peuvent-ils Vous Trouver ?

Si les agents ne peuvent pas d\u00e9couvrir votre contenu, rien d'autre n'a d'importance.

### 1. Autorisez les crawlers IA dans le robots.txt

V\u00e9rifiez que votre `robots.txt` ne bloque pas les crawlers IA. De nombreux sites bloquent involontairement des user agents comme `GPTBot`, `ClaudeBot` ou `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Ajoutez un sitemap.xml

Un sitemap aide les agents \u00e0 d\u00e9couvrir toutes vos pages sans avoir \u00e0 explorer lien par lien. Assurez-vous qu'il est r\u00e9f\u00e9renc\u00e9 dans votre `robots.txt` et qu'il inclut toutes les pages importantes.

### 3. Ajoutez un fichier llms.txt

Le [standard llms.txt](https://llmstxt.org) indique aux agents IA ce que votre site propose et comment y acc\u00e9der. Consid\u00e9rez-le comme un `robots.txt` pour les LLMs \u2014 un fichier d'instructions au niveau du site.

### 4. Ajoutez des donn\u00e9es structur\u00e9es (JSON-LD)

Le balisage Schema.org au format JSON-LD aide les agents \u00e0 comprendre le sujet de votre page sans analyser le HTML. Incluez au minimum `@type`, `name`, `description` et les propri\u00e9t\u00e9s pertinentes pour votre type de contenu.

### 5. Ajoutez des balises Open Graph

Les balises Open Graph (`og:title`, `og:description`, `og:type`, `og:image`) sont utilis\u00e9es par les agents IA pour pr\u00e9visualiser et classifier le contenu, pas uniquement par les r\u00e9seaux sociaux.

## Lisible : Les Agents IA Peuvent-ils Vous Comprendre ?

La plupart des pages web contiennent plus de 90% de code superflu. Les agents ont besoin d'un contenu propre et structur\u00e9.

### 6. Utilisez du HTML s\u00e9mantique

Des balises comme `<main>`, `<article>`, `<section>` et `<aside>` indiquent aux agents o\u00f9 se trouve le vrai contenu. Sans elles, l'agent ne voit qu'une soupe informe d'\u00e9l\u00e9ments `<div>`.

### 7. Ajoutez un H1 unique et descriptif

Le H1 est le signal principal utilis\u00e9 par les agents pour comprendre le sujet d'une page. Utilisez-en un seul, et rendez-le descriptif \u2014 pas "Bienvenue" ni "Accueil."

### 8. Utilisez des titres significatifs

Les titres (`<h2>`, `<h3>`) doivent r\u00e9sumer le contenu de la section. Les agents les utilisent pour une lecture rapide \u2014 comprendre la structure sans tout lire. \u00c9vitez les titres g\u00e9n\u00e9riques comme "Plus d'informations."

### 9. Ajoutez du texte alternatif aux images

Sans texte alternatif, les images sont invisibles pour les agents IA. Avec, les agents comprennent votre contenu visuel et peuvent le r\u00e9f\u00e9rencer dans leurs r\u00e9ponses.

### 10. Utilisez un texte de lien descriptif

Remplacez les textes de lien g\u00e9n\u00e9riques ("cliquez ici", "en savoir plus", "lire la suite") par des libell\u00e9s descriptifs. Les agents utilisent le texte des liens pour d\u00e9cider s'il vaut la peine de les suivre.

### 11. Ne d\u00e9pendez pas de JavaScript pour le contenu

Les agents IA et les crawlers ne peuvent pas ex\u00e9cuter JavaScript. Si votre contenu n\u00e9cessite un rendu c\u00f4t\u00e9 client (React, Vue, Angular SPAs sans SSR), il est invisible pour tout agent IA. Utilisez le SSR ou la g\u00e9n\u00e9ration statique.

### 12. R\u00e9duisez le poids du HTML

Supprimez les styles inline superflus, les \u00e9l\u00e9ments vides et le balisage non s\u00e9mantique. Moins il y a de bruit dans votre HTML, meilleur est le rapport signal/bruit per\u00e7u par les agents.

## Fiable : Les Agents IA Peuvent-ils Vous Faire Confiance ?

Les signaux de confiance aident les agents \u00e0 v\u00e9rifier la pr\u00e9cision des informations et \u00e0 d\u00e9cider s'ils doivent citer votre page.

### 13. Ajoutez une meta description

La meta description est le r\u00e9sum\u00e9 rapide utilis\u00e9 par les agents lorsqu'ils ne lisent pas la page enti\u00e8re. Gardez-la sous 160 caract\u00e8res, sp\u00e9cifique et pr\u00e9cise.

### 14. D\u00e9finissez une URL canonical

`<link rel="canonical">` emp\u00eache les agents d'indexer des versions dupliqu\u00e9es de votre contenu. Indispensable si vous avez des param\u00e8tres d'URL, de la pagination ou des versions imprimables.

### 15. D\u00e9clarez la langue

L'attribut `lang` sur `<html>` indique aux agents dans quelle langue est r\u00e9dig\u00e9 votre contenu. Simple, mais souvent absent \u2014 et cela affecte directement la compr\u00e9hension.

```html
<html lang="fr">
```

### 16. Maintenez le contenu \u00e0 jour

Les agents sont attentifs aux dates. Incluez `datePublished` et `dateModified` dans vos donn\u00e9es structur\u00e9es. Un contenu obsol\u00e8te perd en cr\u00e9dibilit\u00e9.

### 17. Utilisez les en-t\u00eates ETag ou Last-Modified

Ces en-t\u00eates permettent aux agents de v\u00e9rifier si le contenu a chang\u00e9 sans tout ret\u00e9l\u00e9charger. Une mise en cache efficace est le signe d'un site bien entretenu.

## Exploitable : Les Agents IA Peuvent-ils Interagir avec Vous ?

L'avenir du web des agents est transactionnel. Si les agents ne trouvent pas vos actions, vous passez \u00e0 c\u00f4t\u00e9 de conversions.

### 18. D\u00e9finissez des CTAs clairs dans le contenu

Vos boutons "Acheter", "S'abonner", "Demander une d\u00e9mo" doivent \u00eatre explicites dans le contenu HTML, pas uniquement stylis\u00e9s visuellement. Les agents identifient les actions par le texte et la structure HTML, pas par le CSS.

### 19. Utilisez des liens s\u00e9mantiques avec du contexte

Les liens doivent avoir un texte descriptif qui explique o\u00f9 ils m\u00e8nent. Au lieu de "Cliquez ici pour les tarifs", utilisez "Voir les formules tarifaires." Cela aide les agents \u00e0 naviguer sur votre site de mani\u00e8re cibl\u00e9e.

### 20. Placez votre contenu principal en premier

Les agents analysent les premiers centaines de caract\u00e8res pour d\u00e9cider si une page est pertinente. S'ils ne trouvent que de la navigation ou du code superflu avant le vrai contenu, ils risquent d'ignorer votre page enti\u00e8rement. Placez votre H1 et votre contenu principal le plus haut possible dans le HTML.

## Au-del\u00e0 de la Checklist : Le Niveau MAKO

Tout ce qui pr\u00e9c\u00e8de am\u00e9liore votre site pour les agents IA en utilisant le format HTML existant. Mais il y a un plafond \u2014 m\u00eame un HTML parfaitement optimis\u00e9 envoie encore **15 \u00e0 20 fois plus de tokens** que n\u00e9cessaire.

L'\u00e9tape suivante consiste \u00e0 servir du contenu structur\u00e9 et natif pour l'IA en parall\u00e8le de votre HTML gr\u00e2ce \u00e0 la n\u00e9gociation de contenu. C'est ce que le [protocole MAKO](https://makospec.vercel.app/fr/docs) permet : m\u00eame URL, m\u00eame serveur, mais lorsqu'un agent IA visite, il re\u00e7oit du markdown optimis\u00e9 avec des m\u00e9tadonn\u00e9es au lieu du HTML brut.

Le r\u00e9sultat : **~94% de tokens en moins**, des actions d\u00e9clar\u00e9es que les agents peuvent ex\u00e9cuter, et des liens s\u00e9mantiques qu'ils peuvent suivre de mani\u00e8re cibl\u00e9e.

## \u00c9valuez Votre Niveau

Chaque \u00e9l\u00e9ment de cette checklist correspond \u00e0 une v\u00e9rification sp\u00e9cifique dans [MAKO Score](https://makospec.vercel.app/fr/score) \u2014 un audit gratuit qui mesure votre site sur les quatre dimensions (D\u00e9couvrable, Lisible, Fiable, Exploitable) et vous attribue un score de 0 \u00e0 100.

La plupart des sites sans optimisation obtiennent entre 30 et 40. Avec cette checklist, vous pouvez atteindre 60+. Avec MAKO, 90+.

[V\u00e9rifiez votre AI Score maintenant](https://makospec.vercel.app/fr/score).
