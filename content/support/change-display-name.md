---
title: Modifier le nom d'affichage
category: Avancé
cat_order: 2
order: 2
---

Certaines fonctionnalités permettent de changer la valeur d'affichage par défaut, c'est le cas des fiches clients par exemple.

Pour modifier une valeur d'affichage:

1. Allez sur [la page de paramétrage des clients](/customers/settings). (Également accessible en cliquant sur l'icône qui apparaît au survol du menu _Client_).
2. Vous verrez **Formatage**, modifiez ce champ la avec les indications ci-dessous.

Mise en forme :

- Forme de base: `%{PREFIX=VALEUR=SUFFIXE}%`. Le préfix et suffixe est optionnel, la **valeur** peut-être trouvé en petit juste en dessous des champs, il s'agit de texte d'affichage d'un champ [_slugifié_](https://en.wikipedia.org/wiki/Clean_URL#Slug).
- Pour afficher un champ basique: `%{=Valeur=}%`
- Pour afficher un champ avec un préfix: `%{MonPréfix=Valeur=}%`
- Pour afficher un champ avec un suffixe: `%{=Valeur=MonSuffixe}%`
- Pour afficher un préfix et un suffixe: `%{MonPréfix=Valeur=MonSuffixe}%`
- Example réel: Avec ce formatage: `%{=Nom_complet=}% %{(=Entreprise=)}%`:
  - Si le nom complet et l'entreprise est présente, le résultat sera: `John Doe (Nom de l'entreprise)`.
  - Si seul le nom complet est présent: `John Doe`.

Notes et astuces :

- Évitez si possible les valeurs facultatives, sinon pensez à utiliser correctement les préfixes et suffixes pour séparer ces valeurs.
