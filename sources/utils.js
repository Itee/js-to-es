/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

import {
    existsSync,
    readFileSync,
    mkdirSync
} from 'fs'
import {
    sep,
    join
} from 'path'

////////////////////////// CONDITIONAL UTILS /////////////////////////////

/**
 * Check if the parameter is of type string
 *
 * @param {any} value - The value to check the string type
 * @return {boolean}
 */
export function isString ( value ) {

    return ( typeof value === 'string' )

}

/**
 * Check if the parameter is NOT of type string
 *
 * @param {any} value - The value to check the non string type
 * @return {boolean}
 */
export function isNotString ( value ) {

    return ( !isString( value ) )

}

/**
 * Check if the parameter is an array of string.
 * Note: An array of empty string will return true.
 *
 * @param {any} values - The value to check if it is an array of string
 * @return {boolean} - True if array of string, false otherwise
 */
export function isArrayOfString ( values ) {

    if ( !Array.isArray( values ) ) { return false }

    for ( let index = 0, numberOfValues = values.length ; index < numberOfValues ; index++ ) {

        if ( isNotString( values[ index ] ) ) { return false }

    }

    return true

}

///////////////////////// FILES UTILS //////////////////////////////

export function fileExistForPath ( value ) {

    return existsSync( value )

}

export function fileNotExistForPath ( value ) {

    return !fileExistForPath( value )

}

export function getFileForPath ( value ) {

    // In case files doesn't exist
    if ( fileNotExistForPath( value ) ) {
        throw new Error( `Invalid file path "${value}" file does not exist !` )
    }

    return readFileSync( value, 'utf8' )

}

export function getUncommentedFileForPath ( value ) {

    return getFileForPath( value ).replace( /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1' )

}

export function createFoldersTree ( value ) {

    value.split( sep )
         .reduce( ( parentDir, childDir ) => {

             const curDir = join( parentDir, childDir )

             if ( fileNotExistForPath( curDir ) ) {
                 mkdirSync( curDir )
             }

             return curDir

         } )

}

///////////////////////// COMMON UTILS //////////////////////////////

export function makeUnique ( value, index, array ) {

    return array.indexOf( value ) === index

}
