---
title: "Qu'est-ce Que WebMCP et Comment l'Ajouter à Votre Site"
description: "WebMCP est le nouveau standard W3C qui permet aux agents IA d'interagir avec votre site via des formulaires HTML. Apprenez à l'implémenter avec quelques attributs."
---

# Qu'est-ce Que WebMCP et Comment l'Ajouter à Votre Site

Chaque fois qu'un agent IA veut acheter quelque chose, chercher un produit ou réserver une table sur un site web, il doit faire semblant d'être humain. Ouvrir un navigateur, regarder l'écran, cliquer sur des boutons, deviner ce que fait chaque champ.

Ça marche — à peu près. Mais c'est lent, fragile, et ça casse constamment.

WebMCP résout ce problème. Vous ajoutez quelques attributs HTML aux formulaires que vous avez déjà, et les agents IA savent instantanément ce que votre site peut faire.

## Qu'est-ce Que WebMCP

WebMCP (Web Model Context Protocol) est un [standard du W3C](https://webmachinelearning.github.io/webmcp/) soutenu par Google et Microsoft. Il permet aux sites web de déclarer leurs capacités interactives pour que les agents IA les utilisent directement — sans scraping d'écran, sans devinettes.

Vous avez déjà des formulaires : une barre de recherche, un flux de paiement, un widget de réservation. WebMCP vous permet d'étiqueter ces formulaires avec des attributs sémantiques pour que les agents les comprennent comme des outils structurés.

Il a été lancé dans [Chrome 146](https://developer.chrome.com/blog/webmcp-epp) (février 2026) en early preview. Firefox, Safari et Edge participent au [groupe de travail du W3C](https://webmachinelearning.github.io/webmcp/).

## Comment Ça Marche : Ajoutez des Attributs à Vos Formulaires

Voici un formulaire de recherche de produits sans WebMCP :

```html
<form action="/search">
  <input type="text" name="q" placeholder="Rechercher des produits...">
  <button type="submit">Rechercher</button>
</form>
```

Un humain voit une barre de recherche. Un agent IA voit... un champ de texte. Il ne sait pas ce qu'il recherche, quoi taper, ni ce qui se passe quand il envoie.

Maintenant le même formulaire avec WebMCP :

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="Rechercher dans notre catalogue de plus de 3 000 produits par nom, marque ou catégorie"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="Requête"
         toolparamdescription="Nom du produit, marque ou catégorie à rechercher">

  <button type="submit">Rechercher</button>
</form>
```

Trois attributs sur le formulaire, deux sur l'input. L'agent sait maintenant exactement ce que fait cet outil et peut l'utiliser en toute confiance.

### Les Attributs

**Sur `<form>` :**

| Attribut | Requis | Fonction |
|---|---|---|
| `toolname` | Oui | Identifiant unique de l'outil |
| `tooldescription` | Oui | Description en langage naturel de ce que fait le formulaire |
| `toolautosubmit` | Non | Envoi automatique quand l'agent remplit tous les champs |

**Sur `<input>`, `<select>`, `<textarea>` :**

| Attribut | Fonction |
|---|---|
| `toolparamtitle` | Libellé court pour le champ |
| `toolparamdescription` | Quelle donnée va ici (utile quand le libellé n'est pas évident) |

## Exemples pour le E-Commerce

### Recherche de Produits avec Filtres

```html
<form action="/produits"
      toolname="find_products"
      tooldescription="Rechercher des produits avec des filtres optionnels de prix et catégorie">

  <input type="text" name="q"
         toolparamtitle="Recherche"
         toolparamdescription="Nom ou mot-clé du produit">

  <select name="category"
          toolparamtitle="Catégorie"
          toolparamdescription="Filtrer par catégorie de produit">
    <option value="">Toutes les catégories</option>
    <option value="electronics">Électronique</option>
    <option value="clothing">Vêtements</option>
    <option value="home">Maison et Jardin</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="Prix maximum"
         toolparamdescription="Prix maximum en EUR">

  <button type="submit">Rechercher</button>
</form>
```

Quand quelqu'un demande à un assistant IA _"Trouve-moi des écouteurs à moins de 50 EUR"_, l'agent remplit la requête, sélectionne la catégorie, définit le prix maximum et envoie. Sans deviner le DOM.

### Ajouter au Panier

```html
<form action="/panier/add" method="POST"
      toolname="add_to_cart"
      tooldescription="Ajouter un produit au panier par son SKU et sa quantité"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="Identifiant SKU du produit">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="Quantité"
         toolparamdescription="Nombre d'unités à ajouter">

  <button type="submit">Ajouter au panier</button>
</form>
```

### Vérifier le Stock par Code Postal

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="Vérifier si un produit est disponible en retrait dans un magasin proche d'un code postal"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="Code postal"
         toolparamdescription="Code postal à 5 chiffres pour trouver les magasins proches">

  <button type="submit">Vérifier la disponibilité</button>
</form>
```

## L'API JavaScript

Pour les outils dynamiques qui ne peuvent pas être représentés comme des formulaires statiques, utilisez l'API impérative :

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "Calculer le coût de livraison et la date de livraison pour un panier",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "Code postal de destination"
      },
      method: {
        type: "string",
        description: "Méthode de livraison : standard, express ou overnight"
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

L'API `navigator.modelContext` propose également :
- `provideContext()` — Enregistrer plusieurs outils à la fois
- `unregisterTool(name)` — Supprimer un outil spécifique
- `clearContext()` — Supprimer tous les outils enregistrés

Référence complète : [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/).

## Comment le Tester

1. Téléchargez [Chrome Canary](https://www.google.com/chrome/canary/)
2. Ouvrez `chrome://flags/` et activez **"WebMCP for testing"**
3. Installez l'extension WebMCP pour Chrome (utilise une clé API gratuite Gemini depuis [Google AI Studio](https://aistudio.google.com))
4. Ouvrez n'importe quelle page avec des attributs WebMCP — l'agent peut interagir avec vos formulaires

## Pourquoi le Faire Maintenant

Ajouter WebMCP est trivial. Deux ou trois attributs sur des formulaires qui existent déjà. Pas de changements backend, pas de nouveaux fichiers, pas d'API à construire.

Sans ces attributs, les agents IA continueront d'essayer d'utiliser votre site — mais par une automatisation d'écran lente et peu fiable. Avec eux, les agents interagissent avec vos formulaires comme un développeur utiliserait votre API : directement et précisément.

L'adoption précoce compte. Au fur et à mesure que plus d'agents supporteront WebMCP, les sites qui déclarent déjà leurs outils recevront les interactions. Ceux qui ne le font pas seront scrappés — mal.

## WebMCP + llms.txt + MAKO

Trois standards, trois couches :

| Standard | Couche | Ce qu'il fait |
|---|---|---|
| **[llms.txt](/fr/blog/comment-creer-llms-txt)** | Découverte | Indique aux agents de quoi parle votre site |
| **WebMCP** | Interaction | Permet aux agents d'utiliser vos formulaires et outils |
| **[MAKO](https://makospec.vercel.app/fr/docs)** | Contenu | Sert du contenu optimisé pour l'IA par page |

llms.txt est la carte. WebMCP est l'interface. MAKO est le contenu. Ensemble, ils rendent votre site entièrement accessible à chaque agent IA qui le visite.

## Références

- [Spécification W3C WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Chrome Blog : WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — Démos et utilitaires officiels
