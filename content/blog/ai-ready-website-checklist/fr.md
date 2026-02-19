---
title: "Checklist Site Web Prêt pour l'IA : 21 Étapes pour Optimiser pour les Agents IA"
description: "Une checklist pratique pour rendre votre site lisible, découvrable et exploitable par ChatGPT, Claude, Perplexity et tout agent IA."
---

# Checklist Site Web Prêt pour l'IA

Les agents IA représentent une part croissante du trafic de votre site web. ChatGPT, Claude, Perplexity, les assistants d'achat et les bots de recherche visitent des millions de pages chaque jour — mais la plupart des sites ne sont pas conçus pour eux.

Cette checklist couvre 21 étapes concrètes que vous pouvez mettre en œuvre dès aujourd'hui, organisées selon les quatre dimensions essentielles : **Découvrable**, **Lisible**, **Fiable** et **Exploitable**.

## Découvrable : Les Agents IA Peuvent-ils Vous Trouver ?

Si les agents ne peuvent pas découvrir votre contenu, rien d'autre n'a d'importance.

### 1. Autorisez les crawlers IA dans le robots.txt

Vérifiez que votre `robots.txt` ne bloque pas les crawlers IA. De nombreux sites bloquent involontairement des user agents comme `GPTBot`, `ClaudeBot` ou `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Ajoutez un sitemap.xml

Un sitemap aide les agents à découvrir toutes vos pages sans avoir à explorer lien par lien. Assurez-vous qu'il est référencé dans votre `robots.txt` et qu'il inclut toutes les pages importantes.

### 3. Ajoutez un fichier llms.txt

Le [standard llms.txt](https://llmstxt.org) indique aux agents IA ce que votre site propose et comment y accéder. Considérez-le comme un `robots.txt` pour les LLMs — un fichier d'instructions au niveau du site. Consultez notre [guide pour créer un llms.txt efficace](/fr/blog/comment-creer-llms-txt).

### 4. Ajoutez des données structurées (JSON-LD)

Le balisage Schema.org au format JSON-LD aide les agents à comprendre le sujet de votre page sans analyser le HTML. Incluez au minimum `@type`, `name`, `description` et les propriétés pertinentes pour votre type de contenu.

### 5. Ajoutez des balises Open Graph

Les balises Open Graph (`og:title`, `og:description`, `og:type`, `og:image`) sont utilisées par les agents IA pour prévisualiser et classifier le contenu, pas uniquement par les réseaux sociaux.

### 6. Ajoutez des attributs WebMCP à vos formulaires

[WebMCP](https://webmachinelearning.github.io/webmcp/) est un standard W3C qui permet de déclarer vos formulaires comme outils pour les agents IA. Ajoutez les attributs `toolname` et `tooldescription` à vos éléments `<form>` pour que les agents puissent les découvrir et les utiliser directement — sans scraping d'écran. Consultez notre [guide WebMCP](/fr/blog/comment-implementer-webmcp).

## Lisible : Les Agents IA Peuvent-ils Vous Comprendre ?

La plupart des pages web contiennent plus de 90% de code superflu. Les agents ont besoin d'un contenu propre et structuré.

### 7. Utilisez du HTML sémantique

Des balises comme `<main>`, `<article>`, `<section>` et `<aside>` indiquent aux agents où se trouve le vrai contenu. Sans elles, l'agent ne voit qu'une soupe informe d'éléments `<div>`.

### 8. Ajoutez un H1 unique et descriptif

Le H1 est le signal principal utilisé par les agents pour comprendre le sujet d'une page. Utilisez-en un seul, et rendez-le descriptif — pas "Bienvenue" ni "Accueil."

### 9. Utilisez des titres significatifs

Les titres (`<h2>`, `<h3>`) doivent résumer le contenu de la section. Les agents les utilisent pour une lecture rapide — comprendre la structure sans tout lire. Évitez les titres génériques comme "Plus d'informations."

### 10. Ajoutez du texte alternatif aux images

Sans texte alternatif, les images sont invisibles pour les agents IA. Avec, les agents comprennent votre contenu visuel et peuvent le référencer dans leurs réponses.

### 11. Utilisez un texte de lien descriptif

Remplacez les textes de lien génériques ("cliquez ici", "en savoir plus", "lire la suite") par des libellés descriptifs. Les agents utilisent le texte des liens pour décider s'il vaut la peine de les suivre.

### 12. Ne dépendez pas de JavaScript pour le contenu

Les agents IA et les crawlers ne peuvent pas exécuter JavaScript. Si votre contenu nécessite un rendu côté client (React, Vue, Angular SPAs sans SSR), il est invisible pour tout agent IA. Utilisez le SSR ou la génération statique.

### 13. Réduisez le poids du HTML

Supprimez les styles inline superflus, les éléments vides et le balisage non sémantique. Moins il y a de bruit dans votre HTML, meilleur est le rapport signal/bruit perçu par les agents.

## Fiable : Les Agents IA Peuvent-ils Vous Faire Confiance ?

Les signaux de confiance aident les agents à vérifier la précision des informations et à décider s'ils doivent citer votre page.

### 14. Ajoutez une meta description

La meta description est le résumé rapide utilisé par les agents lorsqu'ils ne lisent pas la page entière. Gardez-la sous 160 caractères, spécifique et précise.

### 15. Définissez une URL canonical

`<link rel="canonical">` empêche les agents d'indexer des versions dupliquées de votre contenu. Indispensable si vous avez des paramètres d'URL, de la pagination ou des versions imprimables.

### 16. Déclarez la langue

L'attribut `lang` sur `<html>` indique aux agents dans quelle langue est rédigé votre contenu. Simple, mais souvent absent — et cela affecte directement la compréhension.

```html
<html lang="fr">
```

### 17. Maintenez le contenu à jour

Les agents sont attentifs aux dates. Incluez `datePublished` et `dateModified` dans vos données structurées. Un contenu obsolète perd en crédibilité.

### 18. Utilisez les en-têtes ETag ou Last-Modified

Ces en-têtes permettent aux agents de vérifier si le contenu a changé sans tout retélécharger. Une mise en cache efficace est le signe d'un site bien entretenu.

## Exploitable : Les Agents IA Peuvent-ils Interagir avec Vous ?

L'avenir du web des agents est transactionnel. Si les agents ne trouvent pas vos actions, vous passez à côté de conversions.

### 19. Définissez des CTAs clairs dans le contenu

Vos boutons "Acheter", "S'abonner", "Demander une démo" doivent être explicites dans le contenu HTML, pas uniquement stylisés visuellement. Les agents identifient les actions par le texte et la structure HTML, pas par le CSS.

### 20. Utilisez des liens sémantiques avec du contexte

Les liens doivent avoir un texte descriptif qui explique où ils mènent. Au lieu de "Cliquez ici pour les tarifs", utilisez "Voir les formules tarifaires." Cela aide les agents à naviguer sur votre site de manière ciblée.

### 21. Placez votre contenu principal en premier

Les agents analysent les premiers centaines de caractères pour décider si une page est pertinente. S'ils ne trouvent que de la navigation ou du code superflu avant le vrai contenu, ils risquent d'ignorer votre page entièrement. Placez votre H1 et votre contenu principal le plus haut possible dans le HTML.

## Au-delà de la Checklist : Le Niveau MAKO

Tout ce qui précède améliore votre site pour les agents IA en utilisant le format HTML existant. Mais il y a un plafond — même un HTML parfaitement optimisé envoie encore **15 à 20 fois plus de tokens** que nécessaire.

L'étape suivante consiste à servir du contenu structuré et natif pour l'IA en parallèle de votre HTML grâce à la négociation de contenu. C'est ce que le [protocole MAKO](https://makospec.vercel.app/fr/docs) permet : même URL, même serveur, mais lorsqu'un agent IA visite, il reçoit du markdown optimisé avec des métadonnées au lieu du HTML brut.

Le résultat : **~94% de tokens en moins**, des actions déclarées que les agents peuvent exécuter, et des liens sémantiques qu'ils peuvent suivre de manière ciblée.

## Évaluez Votre Niveau

Chaque élément de cette checklist correspond à une vérification spécifique dans [MAKO Score](https://makospec.vercel.app/fr/score) — un audit gratuit qui mesure votre site sur les quatre dimensions (Découvrable, Lisible, Fiable, Exploitable) et vous attribue un score de 0 à 100.

La plupart des sites sans optimisation obtiennent entre 30 et 40. Avec cette checklist, vous pouvez atteindre 60+. Avec MAKO, 90+.

[Vérifiez votre AI Score maintenant](https://makospec.vercel.app/fr/score).