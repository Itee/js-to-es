/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

const path   = require( 'path' )
const JsToEs = require( '../builds/js-to-es.cjs' ).JsToEs

const converter = new JsToEs()
converter.setInputs( path.join( __dirname, 'inputs' ) )
         .setOutput( path.join( __dirname, 'outputs' ) )
         .setNamespace( 'THREE' )
         .convert()
         .then( () => console.log( 'Success !' ) )
         .catch( error => console.log( error ) )

