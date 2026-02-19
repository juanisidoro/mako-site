---
title: "Ce Qui Se Passe Quand un Agent IA Visite Votre Site Web"
description: "Le parcours invisible de la requete HTTP au raisonnement — et pourquoi 93 % de ce que votre serveur envoie est du bruit qu'un agent IA ne peut pas exploiter."
---

# Ce Qui Se Passe Quand un Agent IA Visite Votre Site Web

Chaque jour, des millions d'agents IA visitent des sites web. ChatGPT, Claude, Perplexity, assistants d'achat, robots de recherche — tous doivent lire du contenu web. Mais aucun d'entre eux ne voit votre site comme un humain le ferait.

Pas de CSS. Pas de mises en page rendues. Pas d'images (en general). Juste du texte brut extrait de votre code source HTML.

Voici ce qui se passe reellement, etape par etape.

## Etape 1 : L'Agent Recoit une URL

Un utilisateur pose une question du type "Compare les prix des casques sans fil sur cette boutique." L'agent IA identifie l'URL pertinente et se prepare a la recuperer.

L'agent lui-meme ne dispose pas d'un navigateur. Il delegue a un outil — generalement un client HTTP ou un service specialise de recuperation web — qui effectuera la requete a sa place.

## Etape 2 : Une Requete HTTP Est Envoyee

L'outil envoie une requete `GET` standard a votre serveur. Votre serveur ne sait pas (et ne se soucie pas) que le visiteur est un agent IA — il repond avec le meme HTML qu'il enverrait a n'importe quel navigateur.

La reponse comprend generalement :
- Barres de navigation et menus (47+ liens)
- Bannieres de consentement aux cookies et scripts
- Feuilles de style CSS (en ligne et externes)
- Bundles JavaScript
- Scripts publicitaires et pixels de suivi
- Le contenu reel, enfoui quelque part au milieu

Pour une page produit e-commerce typique, cela represente **181 Ko de HTML** — soit environ **4 125 tokens** dans la fenetre de contexte d'un LLM.

## Etape 3 : Extraction du Contenu

Le HTML brut est bien trop bruite et couteux en tokens pour etre transmis directement au modele IA. L'outil de recuperation applique donc une etape de pre-traitement :

1. **Supprimer les balises non pertinentes :** `<script>`, `<style>`, `<nav>`, `<footer>`, pixels de suivi
2. **Extraire le texte lisible :** paragraphes, titres, listes, tableaux
3. **Convertir en markdown** (parfois) pour plus de concision
4. **Tronquer** pour respecter les limites de tokens

Cette extraction est heuristique et imparfaite. L'outil ne sait pas quel `<div>` contient le prix de votre produit et lequel contient une banniere de cookies. Il devine en se basant sur la structure HTML — et se trompe souvent.

## Etape 4 : Le Texte Entre dans la Fenetre de Contexte

Le texte nettoye arrive dans la fenetre de contexte de l'IA comme s'il s'agissait d'un message ordinaire. L'agent ne "voit" pas la page — il lit un document texte qui peut ou non representer fidelement ce qu'un humain verrait.

Contraintes importantes a ce stade :
- **La fenetre de contexte est finie.** Un modele a 128K tokens semble spacieux, mais une seule page bruitee peut en consommer 3 a 5 %
- **Aucune information visuelle.** Images, graphiques et mises en page sont invisibles sauf si un texte alternatif est fourni
- **Aucune interaction.** L'agent ne peut pas cliquer sur des boutons, remplir des formulaires ou faire defiler la page

## Etape 5 : L'Agent Raisonne

A partir du texte extrait, l'agent tente de repondre a la question de l'utilisateur. Il identifie les noms de produits, les prix, les descriptions et toute information structuree qu'il peut trouver.

Si l'extraction etait propre, l'agent fournit une excellente reponse. Si l'extraction a manque le prix (parce qu'il etait rendu par JavaScript) ou a inclus le texte d'une banniere de cookies comme s'il s'agissait d'une information produit, la reponse est erronee ou incomplete.

## Les Limites Sont Structurelles

Ce n'est pas un probleme propre a un modele IA en particulier. C'est un probleme structurel lie a la facon dont le web diffuse son contenu :

**Pas d'execution JavaScript.** Si votre contenu est rendu cote client (SPAs React, Vue, Angular), l'agent IA voit un `<div id="root"></div>` vide et rien d'autre. L'integralite de votre site est invisible.

**Pas d'etat ni de sessions.** Chaque requete est independante. L'agent ne peut pas se connecter, conserver un panier d'achat ou acceder a du contenu restreint.

**Pas de navigation intentionnelle.** L'agent ne sait pas lequel de vos 47 liens de navigation mene a du contenu pertinent et lequel mene a votre politique de confidentialite. Chaque lien est tout aussi opaque.

**La troncature est destructrice.** Quand une page est trop longue, l'outil coupe du contenu — et il peut couper la partie la plus importante.

## Ce Que Cela Signifie Pour Votre Entreprise

Si votre site depend du trafic IA — et c'est de plus en plus le cas — le modele actuel est profondement inefficace :

| Ce qui se passe | Impact |
|---|---|
| L'agent telecharge 181 Ko de HTML | Gaspille des tokens sur du bruit |
| L'extraction de contenu se trompe | Informations inexactes sur vos produits |
| Contenu rendu par JavaScript | Totalement invisible pour les agents |
| Pas d'actions structurees | L'agent ne trouve pas vos boutons "Acheter" ou "S'abonner" |
| Pas de liens semantiques | L'agent explore a l'aveugle au lieu de naviguer avec intention |

Le web sert **un seul format pour deux audiences radicalement differentes.** Les navigateurs ont besoin de HTML, CSS et JavaScript. Les agents IA ont besoin de texte structure, de metadonnees et d'actions declarees.

## Une Meilleure Approche

Et si votre serveur pouvait detecter que le visiteur est un agent IA et repondre exactement avec ce dont il a besoin ?

C'est l'idee fondamentale derriere la negociation de contenu pour l'IA — et c'est ce que le [protocole MAKO](https://makospec.vercel.app/fr/docs) rend possible. Au lieu de 4 125 tokens de HTML bruite, l'agent recoit environ 276 tokens de markdown structure et riche en metadonnees. Meme URL, meme serveur, reponse differente.

**Envie de voir comment les agents IA percoivent votre site aujourd'hui ?** [Verifiez votre MAKO Score](https://makospec.vercel.app/fr/score) — un audit gratuit couvrant la Decouvrabilite, la Lisibilite, la Fiabilite et l'Actionnabilite.
