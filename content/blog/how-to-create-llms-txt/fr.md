---
title: "Comment Créer un llms.txt que les Agents IA Utilisent Vraiment"
description: "Guide rapide pour créer un fichier llms.txt efficace — le robots.txt des agents IA. Dites à ChatGPT, Claude et Perplexity ce que propose votre site."
---

# Comment Créer un llms.txt que les Agents IA Utilisent Vraiment

Le fichier `llms.txt` est le moyen le plus simple de dire aux agents IA de quoi parle votre site web. Considérez-le comme le `robots.txt` des LLMs — un fichier texte brut à la racine de votre site qui décrit votre contenu, votre structure et vos fonctionnalités pour la consommation par l'IA.

Si un agent ne sait pas ce que votre site propose, il ne peut pas vous recommander. La mise en place prend 5 minutes.

## Qu'est-ce que llms.txt ?

Le [standard llms.txt](https://llmstxt.org) définit un fichier texte servi à l'adresse `https://votresite.com/llms.txt` qui fournit aux agents IA :

- Une description de votre site et de votre activité
- Les pages clés et leur fonction
- La structure du contenu et des indications de navigation
- Les endpoints d'API ou fonctionnalités spéciales
- Ce que l'agent doit et ne doit pas faire

Ce n'est pas une spécification technique — c'est une conversation avec l'agent en langage naturel.

## Structure de Base

Voici un `llms.txt` minimal qui fonctionne :

```markdown
# Nom de Votre Site

> Description brève de votre site (1-2 phrases).

## Pages Principales

- [Accueil](https://votresite.com) : Ce que les visiteurs trouvent ici
- [Produits](https://votresite.com/produits) : Votre catalogue de produits
- [Blog](https://votresite.com/blog) : Articles sur votre secteur
- [Contact](https://votresite.com/contact) : Comment nous joindre

## Ce que Ce Site Propose

Décrivez votre proposition de valeur en 2-3 phrases.
Qu'est-ce qui rend votre site pertinent pour quelqu'un qui interroge une IA sur votre sujet ?
```

## Exemple Concret

Le `llms.txt` de [makospec.vercel.app](https://makospec.vercel.app/llms.txt) :

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> Protocole ouvert pour servir du contenu web optimisé pour les LLMs.
> Réduit la consommation de tokens d'environ 93 % grâce à la négociation de contenu.

## Documentation

- [Spécification](https://makospec.vercel.app/fr/docs/spec) : Spec complète du protocole MAKO
- [Format CEF](https://makospec.vercel.app/fr/docs/cef) : Compact Embedding Format
- [En-têtes HTTP](https://makospec.vercel.app/fr/docs/headers) : Référence des headers
- [Exemples](https://makospec.vercel.app/fr/docs/examples) : Produit, article, docs

## Outils

- [Analyseur](https://makospec.vercel.app/fr/analyzer) : Générez du MAKO pour n'importe quelle URL
- [Score](https://makospec.vercel.app/fr/score) : Audit de préparation IA (0-100)
- [Répertoire](https://makospec.vercel.app/fr/directory) : Analyses publiques

## Packages

- npm : @mako-spec/js (SDK TypeScript)
- npm : @mako-spec/cli (Outil CLI)
- WordPress : plugin mako-wp
```

## Conseils pour un llms.txt Efficace

### Soyez précis, pas générique

Mauvais : « Nous vendons des choses en ligne. »
Bon : « Plateforme SaaS B2B de gestion d'inventaire. Plus de 2 000 SKUs en électronique, mobilier et fournitures de bureau. »

### Incluez vos URLs clés

Les agents les utilisent pour naviguer sur votre site. Listez les 5 à 10 pages les plus importantes.

### Mentionnez vos fonctionnalités

Si votre site dispose d'une API, d'un moteur de recherche ou de fonctionnalités spéciales, indiquez-le :

```markdown
## API

- POST /api/search : Rechercher des produits par requête
- GET /api/products/:id : Obtenir les détails d'un produit en JSON
```

### Mettez-le à jour quand votre site évolue

Un `llms.txt` obsolète est pire que de ne pas en avoir. Si vous ajoutez une nouvelle section, catégorie de produits ou fonctionnalité, mettez le fichier à jour.

### Restez sous 500 lignes

C'est un résumé, pas votre sitemap complet. Les agents ont des limites de contexte.

## Où le Placer

Le fichier doit être servi à la racine de votre domaine :

```
https://votresite.com/llms.txt
```

**Sites statiques (HTML, Hugo, Astro) :** Ajoutez `llms.txt` dans votre dossier `public/` ou `static/`.

**Next.js :** Créez `public/llms.txt` ou ajoutez un route handler dans `app/llms.txt/route.ts`.

**WordPress :** Utilisez un plugin, ajoutez-le à la racine de votre thème, ou créez une règle de réécriture.

**Nginx/Apache :** Placez le fichier dans le répertoire racine de votre serveur web.

## llms.txt vs MAKO

Ces deux standards se complètent :

| | llms.txt | MAKO |
|---|---|---|
| **Portée** | Niveau site | Niveau page |
| **Objectif** | Décrire ce que propose votre site | Servir du contenu optimisé par page |
| **Format** | Texte brut / markdown | Frontmatter YAML + corps markdown |
| **Idéal pour** | Découverte et navigation | Consommation de contenu et actions |

Utilisez `llms.txt` pour aider les agents à trouver votre contenu. Utilisez [MAKO](https://makospec.vercel.app/fr/docs) pour le servir efficacement.

## Vérifiez que Ça Fonctionne

Après avoir créé votre `llms.txt` :

1. Visitez `https://votresite.com/llms.txt` dans votre navigateur — il devrait s'afficher en texte brut
2. Passez votre site dans [MAKO Score](https://makospec.vercel.app/fr/score) — la vérification « Has llms.txt » devrait réussir
3. Demandez à ChatGPT ou Claude : « Que propose [votresite.com] ? » — si le `llms.txt` est indexé, la réponse s'améliore

Cinq minutes de travail. Une visibilité permanente auprès de chaque agent IA qui visite votre site.
