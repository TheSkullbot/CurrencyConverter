# Currency Converter

## Késako ?

Currency Converter est une petite application web responsive qui consomme l'API de [Fixer.io](https://fixer.io/) pour 
créer un convertisseur de devises en temps réel (ou presque).

Une clé API gratuite est récupérable sur [Fixer.io](https://fixer.io/signup/free). Celle-ci vous autorise 100 requêtes 
par mois, ainsi qu'une mise à jour quotidienne des taux. Certaines offres payantes permettent d'outrepasser cette limite
et d'avoir une fréquence d'actualisation plus élevée, mais ce n'est pas le but ici.

## Pourquoi AngularJS ?

AngularJS est certes vieillissant mais possède un atout certain sur ses successeurs : **son accessibilité**.
En effet, il permet de très facilement appréhender les concepts de data-binding,
sans pour autant passer par les modèles plus complexes de Angular 2+ et le TypeScript.
Ce n'est évidemment pas une solution à long terme, mais reste à mon sens une bonne entrée en matière
pour aborder le concept de data-binding et des frameworks Javascript en général.

## Installation

### Etape 0 : Cloner le dépôt

Rien de bien sorcier ici, à condition évidemment d'avoir préalablement installé Git sur votre machine.

```bash
git clone git@github.com:TheSkullbot/CurrencyConverter.git
```

### Etape 1 : Modifier la clé API Fixer.io dans index.html

Dans le fichier ``index.html``, modifier la ligne 20 et remplacer YOUR_API_KEY_HERE par la clé obtenue précédemment.
```html
<script>
  var key = "YOUR_API_KEY_HERE";
</script>
```

Dans le fichier ``update.js``, modifier la ligne 13 et remplacer YOUR_API_KEY_HERE par la clé obtenue précédemment.
```js
// API
const key = "YOUR_API_KEY_HERE";
```

### Etape optionnelle : Ajouter update.js à crontab
*Cette étape nécessite un planificateur de tâches et une installation de NodeJS.
L'exemple suivant est fourni pour crontab et Linux.*


Afin d'éviter d'épuiser la limite de requête gratuites sur Fixer.io, une mise en cache coté serveur est possible.
Celle-ci repose sur une actualisation journalière des taux de changes, effectuée par un script NodeJS.
Pour ce faire ajoutez la ligne suivante dans le crontab :

```batch
00 03 * * * node /path/to/update.js
```

NodeJS est donc indispensable pour cette étape. Mais pas de panique, en plus de mettre en cache les taux coté
client (localStorage), l'application possède également une version par défaut des taux de change sur lesquelles
elle s'appuiera s'il n'y a pas de cache serveur ou si les requêtes API n'aboutissent pas
(si Fixer.io ne réponds pas ou si vous avez renversé votre café sur le routeur par exemple).

Pensez aussi à donner les droits en écriture sur le dossier ``data`` car c'est là que les taux à jours sont enregistrés ;)

### Etape 3 : Profiter !

Ouvrez le fichier ``index.html`` dans votre navigateur (ou visitez l'URL à laquelle se trouve l'app hébergée) et 
découvrez un convertisseur rempli de néon, tout droit sorti des 80's !

## HTTPS & Mixed content

L'API Fixer.io ne supporte pas les requêtes en HTTPS pour l'offre gratuite. Or un site en HTTPS ne peut faire de requêtes
HTTP non sécurisée (mixed content). Si vous êtes dans ce cas, l'application ne pourra pas récupérer les taux à jour 
correctement. Il faudra passer par la méthode NodeJS, qui elle ne pose pas de problème de mixed content.
Et comme les taux seront à jour sur le serveur, l'app n'essayera de les récupérer via l'API, mais directement en HTTPS
sur le serveur.

## CDN

Dans un soucis de simplicité, les librairies externes suivantes sont incluses via CDN :

 - AngularJS 1.7.8
 - Font Awesome 5
 - Google Font Sarpanch
 - Google Font Monoton

