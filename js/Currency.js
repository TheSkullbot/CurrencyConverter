//==========================================================================================
//  Fichier     : Currency.js
//  Description : Contrôleur principal
//-------------------------------------------------------------------------------------
//  Auteur(s)   : Pierre Briffaux
//==========================================================================================

angular.module( 'PowerGlove', [] ).controller( 'Currency', function( $document, $scope, $http ){
  /*==============*/
  /*  Variables   */
  /*==============*/

  // I18N
  $scope.locale = (localStorage.getItem( 'locale' ) === null) ? "en" : localStorage.getItem( 'locale' );
  $scope.i18n   = {
    "en" : en,
    "fr" : fr,
  };

  // Scope
  $scope.from = {amount : 0.00, currency : "EUR"};
  $scope.to   = {amount : 0.00, currency : "USD"};

  // Taux de changes
  $scope.rates = null;

  // Background music
  $scope.bgm = false;

  // Element <audio> (pour ne pas le chercher a chaque fois)
  var bgm    = document.querySelector( '#bgm' );
  bgm.volume = 0.1;

  /*==============*/
  /* Fonctions    */
  /*==============*/

  /* Conversion EUR => Devise */
  $scope.convertFromEUR = function(){
    $scope.to.amount = Math.round( ($scope.from.amount * $scope.rates[$scope.to.currency]) * 100 ) / 100;
  };

  /* Conversion Devise => EUR */
  $scope.convertToEUR = function(){
    $scope.from.amount = Math.round( ($scope.to.amount / $scope.rates[$scope.to.currency]) * 100 ) / 100;
  };

  /* Récupération des taux de change */
  $scope.loadRates = function(){
    // On essaye de récupérer dans le localStorage pour économiser une requête
    var local = (localStorage.getItem( 'rates' ) === null) ? null : JSON.parse( localStorage.getItem( 'rates' ) );

    // Si le localStorage est vide ou date de plus de 24h, on fait la requête, sinon on lit juste le localStorage
    if( local === null || local.timestamp === 0 || Date.now() - local.timestamp < 3600 * 24 * 1000 )
    {
      $http( {
        url     : "data/fixer.json", // Mis à jour quotidiennement par un script NodeJS (update.js)
        method  : "GET",
        headers : {"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8;"},
      } )
        .then(
          function successCallback( response ){
            if( response.data && Date.now() - response.data.timestamp < 3600 * 24 * 1000 )
              $scope.applyRates( response.data );
            else
              $scope.fixerRates();
            return true;
          },
          function errorCallback(){
            // Si on arrive pas récupérer les rates à jour depuis le serveur, on interroge l'API Fixer.io
            $scope.fixerRates();
            return true;
          }
        );
    }
    else
      $scope.applyRates( local );
  };

  /* Récupération des taux de change via l'API Fixer au cas où le localStorage et le serveur ne sont pas a jour */
  /* Ne devrait pas arriver a moins que le script NodeJS ne soit pas renseigné correctement dans crontab */
  $scope.fixerRates = function(){
    $http( {
      // HTTPS non supporté en mode gratuit, attention au mixed content si le reste du site est en HTTPS !
      url     : "http://data.fixer.io/api/latest?access_key="+key+"&format=1",
      method  : "GET",
      headers : {"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8;"},
    } )
      .then(
        function successCallback( response ){
          $scope.applyRates( response.data );
          return true;
        },
        function errorCallback(){
          // Si on arrive toujours pas a récupérer les infos, on utilise les données de secours (stockées dans data/fallback.js)
          $scope.applyRates( fallback );
          return true;
        }
      );
  };

  /* Application des taux et mise en cache */
  $scope.applyRates = function( data ){
    $scope.rates = data.rates;
    localStorage.setItem( 'rates', JSON.stringify( data ) ); // Mise à jour du localStorage
    setTimeout( function(){
      document.querySelector( '#loader' ).style.display = "none";
      document.querySelector( '#page' ).style.display   = "block";
    }, 500 );// Un petit délai pour qu'on ait le temps de voir l'écran de chargement :p
  };

  /* Activation / Désactivation de la musique */
  $scope.toggleMusic = function(){
    if( bgm.paused )
    {
      bgm.play(); // On ne met a jour le scope que si le play a fonctionné (car certains navigateurs bloquent l'autoplay)
      $scope.bgm = true;
    }
    else
    {
      bgm.pause();
      $scope.bgm = false;
    }
  };

  /* Changement de langue d'affichage */
  $scope.toggleLang = function(){
    $scope.locale = $scope.locale === 'en' ? 'fr' : 'en';
    localStorage.setItem( 'locale', $scope.locale ); // Mise à jour du localStorage
  };
} );
