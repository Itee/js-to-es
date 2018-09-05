/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

const gulp     = require( 'gulp' )
const util     = require( 'gulp-util' )
const jsdoc    = require( 'gulp-jsdoc3' )
const eslint   = require( 'gulp-eslint' )
const rollup   = require( 'rollup' )
const path     = require( 'path' )
const del      = require( 'del' )

const log     = util.log
const colors  = util.colors
const red     = colors.red
const green   = colors.green
const blue    = colors.blue
const cyan    = colors.cyan
const yellow  = colors.yellow
const magenta = colors.magenta

/**
 * @method npm run clean
 * @description Will delete builds and temporary folders
 */
gulp.task( 'clean', () => {

    return del( [
        './builds',
        './documentation'
    ] )

} )

/**
 * @method npm run lint
 * @description Will lint the sources files and try to fix the style when possible
 */
gulp.task( 'lint', () => {

    const eslintConfig = require( './configs/eslint.conf.js' )
    const filesToLint  = [
        'gulpfile.js',
        'sources/**/*.js',
        'tests/**/*.js'
    ]

    return gulp.src( filesToLint )
               .pipe( eslint( eslintConfig ) )
               .pipe( eslint.format( 'stylish' ) )
               .pipe( gulp.dest( './sources' ) )
               .pipe( eslint.failAfterError() )

} )

/**
 * @method npm run doc
 * @description Will generate this documentation
 */
gulp.task( 'doc', ( done ) => {

    const config = require( './configs/jsdoc.conf' )
    const files  = [
        'README.md',
        'gulpfile.js',
        './configs/*.js',
        './sources/**/*.js',
        './tests/**/*.js'
    ]

    gulp.src( files, { read: false } )
        .pipe( jsdoc( config, done ) )

} )

/**
 * @method npm run build
 * @description Will build sources using optional arguments.
 */
gulp.task( 'build', ( done ) => {

    const options = processArguments( process.argv )
    const configs = createBuildsConfigs( options )

    nextBuild()

    function processArguments ( processArgv ) {
        'use strict'

        let defaultOptions = {
            fileName:     'js-to-es',
            inputPath:    path.join( __dirname, 'sources' ),
            outputPath:   path.join( __dirname, 'builds' ),
            environments: [ 'development', 'production' ],
            formats:      [ 'cjs', 'es' ],
            sourceMap:    true
        }

        const argv = processArgv.slice( 3 ) // Ignore nodejs, script paths and gulp params
        argv.forEach( argument => {

            if ( argument.indexOf( '-n' ) > -1 || argument.indexOf( '--name' ) > -1 ) {

                defaultOptions.fileName = argument.split( ':' )[ 1 ]

            } else if ( argument.indexOf( '-i' ) > -1 || argument.indexOf( '--input' ) > -1 ) {

                defaultOptions.inputPath = argument.split( ':' )[ 1 ]

            } else if ( argument.indexOf( '-o' ) > -1 || argument.indexOf( '--output' ) > -1 ) {

                defaultOptions.outputPath = argument.split( ':' )[ 1 ]

            } else if ( argument.indexOf( '-f' ) > -1 || argument.indexOf( '--format' ) > -1 ) {

                const splits    = argument.split( ':' )
                const splitPart = splits[ 1 ]

                defaultOptions.formats = []
                defaultOptions.formats.push( splitPart )

            } else if ( argument.indexOf( '-d' ) > -1 || argument.indexOf( '--dev' ) > -1 ) {

                defaultOptions.environments = []
                defaultOptions.environments.push( 'development' )

            } else if ( argument.indexOf( '-p' ) > -1 || argument.indexOf( '--prod' ) > -1 ) {

                defaultOptions.environments = []
                defaultOptions.environments.push( 'production' )

            } else if ( argument.indexOf( '-s' ) > -1 || argument.indexOf( '--sourcemap' ) > -1 ) {

                defaultOptions.sourceMap = true

            } else {

                throw new Error( `Build Script: invalid argument ${argument}. Type \`npm run help build\` to display available argument.` )

            }

        } )

        return defaultOptions

    }

    function createBuildsConfigs ( options ) {
        'use strict'

        let configs = []

        for ( let formatIndex = 0, numberOfFormats = options.formats.length ; formatIndex < numberOfFormats ; ++formatIndex ) {
            const format = options.formats[ formatIndex ]

            for ( let envIndex = 0, numberOfEnvs = options.environments.length ; envIndex < numberOfEnvs ; ++envIndex ) {
                const environment  = options.environments[ envIndex ]
                const onProduction = (environment === 'production')

                const config = require( './configs/rollup.conf' )( options.fileName, options.inputPath, options.outputPath, format, onProduction, options.sourceMap )

                configs.push( config )
            }
        }

        return configs

    }

    function nextBuild () {
        'use strict'

        if ( configs.length === 0 ) {
            done()
            return
        }

        build( configs.pop(), nextBuild )

    }

    function build ( config, done ) {

        log( `Building ${config.outputOptions.file}` )

        rollup.rollup( config.inputOptions )
              .then( ( bundle ) => {

                  bundle.write( config.outputOptions )
                        .catch( ( error ) => {
                            log( red( error ) )
                            done()
                        } )

                  done()
              } )
              .catch( ( error ) => {
                  log( red( error ) )
                  done()
              } )

    }

} )
