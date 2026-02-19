---
title: "Decouvrez MAKO : Le Protocole Ouvert pour un Contenu Optimise pour l'IA"
description: "Pourquoi nous avons cree MAKO et comment il reduit la consommation de tokens de 94 % tout en rendant chaque page web comprehensible par les agents IA."
---

# Decouvrez MAKO

Le web n'a pas ete concu pour les agents IA. Chaque fois que ChatGPT, Perplexity ou un assistant d'achat visite un site web, il telecharge des barres de navigation, des bannieres de cookies, des scripts publicitaires et des milliers de lignes de markup — simplement pour trouver le nom et le prix d'un produit.

Le resultat ? **Plus de 4 000 tokens consommes** avant que l'agent n'atteigne le contenu reel. Pour les SPAs rendues en JavaScript, la situation est encore pire : l'agent voit un `<div id="root"></div>` vide et rien d'autre.

## Le Probleme

Prenons une page produit typique d'un site e-commerce. Un visiteur humain voit une mise en page soignee avec l'image du produit, le titre, le prix et un bouton "Ajouter au panier". Un agent IA voit ceci :

- 181 Ko de HTML brut
- Une navigation avec 47 liens
- 3 scripts de consentement aux cookies
- Du CSS inline pour plus de 200 composants
- Les donnees reelles du produit enfouies quelque part au milieu

C'est **93 % de bruit, 7 % de signal**.

## Ce Que Fait MAKO

MAKO ajoute une couche structuree et optimisee pour l'IA a n'importe quel site web grace a la negociation de contenu HTTP standard. Lorsqu'un agent IA envoie `Accept: text/mako+markdown`, le serveur repond avec un document MAKO propre au lieu du HTML brut :

```yaml
---
mako: "1.0"
type: product
entity: "Casque Sans Fil Pro"
tokens: 276
language: fr
updated: "2026-02-20T10:00:00Z"
---
```

La meme URL, le meme serveur — simplement une reponse differente pour un public different.

## Choix de Conception Cles

**La negociation de contenu plutot que de nouveaux endpoints.** Nous avons choisi le modele du header `Accept` car il ne necessite aucune modification d'URL. Chaque page existante peut servir du MAKO sans creer de routes supplementaires.

**Markdown plutot que JSON.** Les LLMs sont entraines sur du markdown. Un document markdown bien structure avec un frontmatter YAML est plus econome en tokens et plus naturellement lisible par les modeles de langage que du JSON equivalent.

**10 types de contenu.** Produit, article, documentation, landing, listing, profil, evenement, recette, FAQ et personnalise. Chaque type indique a l'agent exactement quelle structure attendre.

**Actions declarees.** Au lieu d'esperer que l'agent trouve votre bouton "Ajouter au panier" dans le HTML, MAKO declare des actions lisibles par la machine avec des endpoints et des parametres.

## Les Chiffres

Dans nos benchmarks sur plus de 50 pages reelles :

| Metrique | HTML Brut | MAKO |
|----------|-----------|------|
| Taille moyenne | 181 Ko | 3 Ko |
| Tokens moyens | ~4 125 | ~276 |
| Reduction | — | **93 %** |

Ce n'est pas une amelioration marginale. C'est la difference entre un agent capable de traiter 3 pages par fenetre de contexte et un autre qui en traite 45.

## Pour Commencer

MAKO est disponible des aujourd'hui :

- **WordPress :** Installez le [plugin mako-wp](https://github.com/juanisidoro/mako-wp) — activez-le et il fonctionne avec WooCommerce, Yoast et ACF
- **N'importe quel stack :** Utilisez [@mako-spec/js](https://www.npmjs.com/package/@mako-spec/js) — SDK TypeScript avec middleware Express
- **Valider :** Utilisez [@mako-spec/cli](https://www.npmjs.com/package/@mako-spec/cli) pour valider vos fichiers MAKO

Le protocole est open source sous licence Apache 2.0. La specification complete est disponible sur [makospec.vercel.app/docs](https://makospec.vercel.app/fr/docs).

## Et Ensuite

Nous travaillons sur MAKO Score — un outil d'audit qui mesure le degre de preparation a l'IA de n'importe quel site web selon quatre dimensions : Decouvrable, Lisible, Fiable et Actionnable. Testez votre site sur [makospec.vercel.app/score](https://makospec.vercel.app/fr/score).

Le web accueille un nouveau public. MAKO vous aide a parler leur langage.
