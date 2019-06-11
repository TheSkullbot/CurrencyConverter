//==========================================================================================
//  Fichier     : update.js
//  Description : Script NodeJS de mise à jour quotidienne des taux de changes
//-------------------------------------------------------------------------------------
//  Auteur(s)   : Pierre Briffaux
//==========================================================================================

// Libs
const http = require( 'http' );
const fs   = require( 'fs' );

// API
const key = "YOUR_API_KEY_HERE";
const url = "http://data.fixer.io/api/latest?access_key=" + key + "&format=1";

// Requête AJAX
http.get( url, ( resp ) =>
{
  // Buffer
  let data = '';
  // Remplissage du buffer
  resp.on( 'data', ( chunk ) => {
    data += chunk;
  } );
  // Ecriture du fichier
  resp.on( 'end', () => {
    fs.writeFile( 'data/fixer.json', data, ( err ) => {
      if( err )
        throw err;
    } );
  } );
} );

