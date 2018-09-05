'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

/**
 * Check if the parameter is of type string
 *
 * @param {any} value - The value to check the string type
 * @return {boolean}
 */

function isString(value) {
  return typeof value === 'string';
}
/**
 * Check if the parameter is NOT of type string
 *
 * @param {any} value - The value to check the non string type
 * @return {boolean}
 */

function isNotString(value) {
  return !isString(value);
}
/**
 * Check if the parameter is an array of string.
 * Note: An array of empty string will return true.
 *
 * @param {any} values - The value to check if it is an array of string
 * @return {boolean} - True if array of string, false otherwise
 */

function isArrayOfString(values) {
  if (!Array.isArray(values)) {
    return false;
  }

  for (var index = 0, numberOfValues = values.length; index < numberOfValues; index++) {
    if (isNotString(values[index])) {
      return false;
    }
  }

  return true;
} ///////////////////////// FILES UTILS //////////////////////////////

function fileExistForPath(value) {
  return fs.existsSync(value);
}
function fileNotExistForPath(value) {
  return !fileExistForPath(value);
}
function getFileForPath(value) {
  // In case files doesn't exist
  if (fileNotExistForPath(value)) {
    throw new Error("Invalid file path \"".concat(value, "\" file does not exist !"));
  }

  return fs.readFileSync(value, 'utf8');
}
function getUncommentedFileForPath(value) {
  return getFileForPath(value).replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
}
function createFoldersTree(value) {
  value.split(path.sep).reduce(function (parentDir, childDir) {
    var curDir = path.join(parentDir, childDir);

    if (fileNotExistForPath(curDir)) {
      fs.mkdirSync(curDir);
    }

    return curDir;
  });
} ///////////////////////// COMMON UTILS //////////////////////////////

function makeUnique(value, index, array) {
  return array.indexOf(value) === index;
}

/**
 * Extend the String prototype if contains not exist.
 * It allow to check if the string contains or not a target string
 *
 * @type {Function}
 * @param {string} target - The string to match in current string
 * @return {boolean}
 */

String.prototype.contains = String.prototype.contains || function (target) {
  return this.indexOf(target) > -1;
};

var JsToEs =
/*#__PURE__*/
function () {
  function JsToEs() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, JsToEs);

    // Public
    this.inputs = options.inputs || [''];
    this.excludes = options.excludes || [''];
    this.output = options.output || '';
    this.edgeCases = options.edgeCases || [];
    this.banner = options.banner || '';
    this.namespace = options.namespace || ''; // Private

    this._exportMap = {};
    this._fileMap = {};
    this._regex = {
      'AMD': new RegExp(/define\.amd/g),
      'CJS': new RegExp(/module\.exports\s*=\s*\{?[^}]*}?/g),
      'UMD': new RegExp(/\(function\s*\(root,\s*factory\)\s*\{/g),
      'Classic': new RegExp("(".concat(this._namespace, ".(\\w+)\\s*=\\s*)+\\s*function"), 'g'),
      'Prototype': new RegExp("prototype\\.constructor\\s?=\\s?(".concat(this._namespace, "\\.)?(\\w)+"), 'g'),
      'Library': new RegExp("".concat(this._namespace, ".(\\w+) = \\{")),
      'Es6': new RegExp(/(export\s(default|var))|((import|export)[\r\n\s]*(default)?({[\w\s,]+}\s?(from)?))/, 'g')
    };
  }

  _createClass(JsToEs, [{
    key: "setInputs",
    // Chainable setters
    value: function setInputs(value) {
      this.inputs = value;
      return this;
    }
  }, {
    key: "setExcludes",
    value: function setExcludes(value) {
      this.excludes = value;
      return this;
    }
  }, {
    key: "setOutput",
    value: function setOutput(value) {
      this.output = value;
      return this;
    }
  }, {
    key: "setEdgeCases",
    value: function setEdgeCases(value) {
      this.edgeCases = value;
      return this;
    }
  }, {
    key: "setBanner",
    value: function setBanner(value) {
      this.banner = value;
      return this;
    }
  }, {
    key: "setNamespace",
    value: function setNamespace(value) {
      this.namespace = value;
      return this;
    }
  }, {
    key: "convert",
    value: function convert(callback) {
      var _this = this;

      var inputs = this._inputs;
      var excludes = this._excludes;
      var output = this._output;
      var edgeCases = this._edgeCases;
      var banner = this._banner;
      var namespace = this._namespace;
      var regex = this._regex;

      if (callback) {
        try {
          var allFilesPaths = JsToEs._getFilesPathsUnder(inputs);

          var availableFilesPaths = JsToEs._excludesFilesPaths(allFilesPaths, excludes);

          var jsFiles = JsToEs._filterJavascriptFiles(availableFilesPaths);

          this._fileMap = JsToEs._createFilesMap(namespace, regex, availableFilesPaths, edgeCases, inputs, output);
          this._exportMap = JsToEs._createExportMap(jsFiles, namespace, regex, edgeCases, inputs, output);

          JsToEs._processFiles(this._fileMap, this._exportMap, banner);

          callback();
        } catch (error) {
          callback(error);
        }
      } else {
        return new Promise(function (resolve, rejects) {
          try {
            var _allFilesPaths = JsToEs._getFilesPathsUnder(inputs);

            var _availableFilesPaths = JsToEs._excludesFilesPaths(_allFilesPaths, excludes);

            var _jsFiles = JsToEs._filterJavascriptFiles(_availableFilesPaths);

            _this._fileMap = JsToEs._createFilesMap(namespace, regex, _availableFilesPaths, edgeCases, inputs, output);
            _this._exportMap = JsToEs._createExportMap(_jsFiles, namespace, regex, edgeCases, inputs, output);

            JsToEs._processFiles(_this._fileMap, _this._exportMap, banner);

            resolve();
          } catch (error) {
            rejects(error);
          }
        });
      }
    }
  }, {
    key: "inputs",
    get: function get() {
      return this._inputs;
    },
    set: function set(value) {
      if (isArrayOfString(value)) {
        this._inputs = value;
      } else if (isString(value)) {
        this._inputs = [value];
      } else {
        throw new TypeError('Invalid inputs arguments, expected a String or Array of String');
      }
    }
  }, {
    key: "excludes",
    get: function get() {
      return this._excludes;
    },
    set: function set(value) {
      if (isArrayOfString(value)) {
        this._excludes = value;
      } else if (isString(value)) {
        this._excludes = [value];
      } else {
        throw new TypeError('Invalid excludes arguments, expected a String or Array of String');
      }

      return this;
    }
  }, {
    key: "output",
    get: function get() {
      return this._output;
    },
    set: function set(value) {
      if (isString(value)) {
        this._output = value;
      } else {
        throw new TypeError('Invalid output arguments, expected a String');
      }

      return this;
    }
  }, {
    key: "edgeCases",
    get: function get() {
      return this._edgeCases;
    },
    set: function set(value) {
      // Todo: object edge case or validate object structure of input value here !
      this._edgeCases = value;
    }
  }, {
    key: "banner",
    get: function get() {
      return this._banner;
    },
    set: function set(value) {
      if (isNotString(value)) {
        throw new TypeError('Invalid banner argument, expect a string.');
      }

      this._banner = value;
    }
  }, {
    key: "namespace",
    get: function get() {
      return this._namespace;
    },
    set: function set(value) {
      if (isNotString(value)) {
        throw new TypeError('Invalid namespace argument, expect a string.');
      } // namespace will be used in regex so escape it
      // https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript


      this._namespace = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      this._regex = {
        'AMD': new RegExp(/define\.amd/g),
        'CJS': new RegExp(/module\.exports\s*=\s*\{?[^}]*}?/g),
        'UMD': new RegExp(/\(function\s*\(root,\s*factory\)\s*\{/g),
        'Classic': new RegExp("(".concat(this._namespace, ".(\\w+)\\s*=\\s*)+\\s*function"), 'g'),
        'Prototype': new RegExp("prototype\\.constructor\\s?=\\s?(".concat(this._namespace, "\\.)?(\\w)+"), 'g'),
        'Library': new RegExp("".concat(this._namespace, ".(\\w+) = \\{")),
        'Es6': new RegExp(/(export\s(default|var))|((import|export)[\r\n\s]*(default)?({[\w\s,]+}\s?(from)?))/, 'g')
      };
    }
  }, {
    key: "exportMap",
    get: function get() {
      return this._exportMap;
    }
  }, {
    key: "fileMap",
    get: function get() {
      return this._fileMap;
    }
    /**
     * Return all the files paths under filePaths in a recursive way.
     *
     * @param filePaths - An array of string, representing the base path where looking for get all files paths
     * @return {Array.<string>} - An array of files paths
     * @private
     */

  }], [{
    key: "_getFilesPathsUnder",
    value: function _getFilesPathsUnder(filePaths) {
      var files = [];

      if (Array.isArray(filePaths)) {
        var filePath = undefined;

        for (var pathIndex = 0, numberOfPaths = filePaths.length; pathIndex < numberOfPaths; pathIndex++) {
          filePath = filePaths[pathIndex];

          var results = JsToEs._checkStateOf(filePath);

          Array.prototype.push.apply(files, results);
        }
      } else {
        var _results = JsToEs._checkStateOf(filePaths);

        Array.prototype.push.apply(files, _results);
      }

      return files;
    }
  }, {
    key: "_getFilesPathsUnderFolder",
    value: function _getFilesPathsUnderFolder(folder) {
      var files = [];
      fs.readdirSync(folder).forEach(function (name) {
        var filePath = path.resolve(folder, name);

        var results = JsToEs._checkStateOf(filePath);

        Array.prototype.push.apply(files, results);
      });
      return files;
    }
  }, {
    key: "_checkStateOf",
    value: function _checkStateOf(filePath) {
      if (fileNotExistForPath(filePath)) {
        throw new ReferenceError("Invalid file path \"".concat(filePath, "\"."));
      }

      var stats = fs.statSync(filePath);

      if (stats.isFile()) {
        return [filePath];
      } else if (stats.isDirectory()) {
        return JsToEs._getFilesPathsUnderFolder(filePath);
      } else {
        throw new ReferenceError("Invalid stats file object.");
      }
    }
    /**
     * Will filter file paths an keep only js files
     *
     * @param {Array.<string>} filePaths - An array of path to filter
     * @return {Array.<string>} The filtered path with only javascript files
     * @private
     */

  }, {
    key: "_filterJavascriptFiles",
    value: function _filterJavascriptFiles(filePaths) {
      var filteredFilesPath = [];
      var filePath = undefined;

      for (var filePathIndex = 0, numberOfFilePaths = filePaths.length; filePathIndex < numberOfFilePaths; filePathIndex++) {
        filePath = filePaths[filePathIndex]; // Not a js file like fonts or shaders

        var fileExtension = path.extname(filePath);

        if (fileExtension !== '.js') {
          //            console.log( 'Not Js:  ' + filePath )
          continue;
        }

        filteredFilesPath.push(filePath);
      }

      return filteredFilesPath;
    }
    /**
     * Will create an array without the strings in filePaths that are matched in excludes paths
     *
     * @param {Array.<string>} filePaths - An array of string to clean
     * @param {Array.<string>} excludes - The paths to remove
     * @return {Array.<string>} The cleaned filePaths of excludes paths
     * @private
     */

  }, {
    key: "_excludesFilesPaths",
    value: function _excludesFilesPaths(filePaths, excludes) {
      var filteredFilesPath = [];
      var filePath = undefined;

      for (var filePathIndex = 0, numberOfFilePaths = filePaths.length; filePathIndex < numberOfFilePaths; filePathIndex++) {
        filePath = filePaths[filePathIndex];

        if (JsToEs._isExclude(filePath, excludes)) {
          //            console.log( 'Exclude: ' + filePath )
          continue;
        }

        filteredFilesPath.push(filePath);
      }

      return filteredFilesPath;
    }
  }, {
    key: "_isExclude",
    value: function _isExclude(path$$1, excludes) {
      var isExclude = false;
      var excludePattern = undefined;

      for (var i = 0, pathLength = excludes.length; i < pathLength; i++) {
        excludePattern = excludes[i];

        if (excludePattern.length === 0) {
          continue;
        } // In case this is a file name it must fully match


        if (excludePattern.indexOf('.') > -1) {
          var fileName = path$$1.replace(/^.*(\\|\/|\:)/, '');

          if (fileName === excludePattern) {
            isExclude = true;
          }
        } else if (path$$1.contains(excludePattern)) {
          isExclude = true;
        }
      }

      return isExclude;
    }
  }, {
    key: "_getFileType",
    value: function _getFileType(file, regex) {
      var es6Match = file.match(regex[JsToEs.JavascriptType.Es6]);

      if (es6Match && es6Match.length > 0) {
        return JsToEs.JavascriptType.Es6;
      }

      var amdMatch = file.match(regex[JsToEs.JavascriptType.AMD]);

      if (amdMatch && amdMatch.length > 0) {
        return JsToEs.JavascriptType.AMD;
      }

      var cjsMatch = file.match(regex[JsToEs.JavascriptType.CJS]);

      if (cjsMatch && cjsMatch.length > 0) {
        return JsToEs.JavascriptType.CJS;
      }

      var classicObjectMatch = file.match(regex[JsToEs.JavascriptType.Classic]);

      if (classicObjectMatch && classicObjectMatch.length > 0) {
        return JsToEs.JavascriptType.Classic;
      }

      var prototypedObjectMatch = file.match(regex[JsToEs.JavascriptType.Prototype]);

      if (prototypedObjectMatch && prototypedObjectMatch.length > 0) {
        return JsToEs.JavascriptType.Prototype;
      }

      var libMatch = file.match(regex[JsToEs.JavascriptType.Library]);

      if (libMatch && libMatch.length > 0) {
        return JsToEs.JavascriptType.Library;
      }

      return JsToEs.JavascriptType.Unknown;
    }
  }, {
    key: "_convertFile",
    value: function _convertFile(banner, fileDatas, exportMap) {
      var outputPath = fileDatas.output;
      var outputDir = path.dirname(outputPath);

      var formatedImports = JsToEs._formatImportStatements(outputPath, exportMap, fileDatas.imports);

      var formatedFile = JsToEs._formatReplacementStatements(fileDatas.file, fileDatas.replacements);

      var formatedExports = JsToEs._formatExportStatements(outputPath, fileDatas.exports);

      var outputFile = banner + formatedImports + formatedFile + formatedExports;
      createFoldersTree(outputDir);
      fs.writeFileSync(outputPath, outputFile);
    }
  }, {
    key: "_copyFile",
    value: function _copyFile(banner, fileDatas) {
      var outputPath = fileDatas.output;
      var outputDir = path.dirname(outputPath);
      var file = banner + fileDatas.file;
      createFoldersTree(outputDir);
      fs.writeFileSync(outputPath, file);
    }
  }, {
    key: "_getAllImportsStatementIn",
    value: function _getAllImportsStatementIn(namespace, file, exports) {
      var statements = [];
      var matchs = file.match(/import\s+(?:(?:({[\w\s,]+})|([\w,*-]+))\s+)+from/g) || [];
      matchs.filter(makeUnique).forEach(function (value) {
        var results = value.replace('import', '').replace('from', '').replace(/[{}]/g, '').replace(/\s+/g, '').split(','); // Check if the extends statement is not about the exported object !

        var result = undefined;

        for (var i = results.length - 1; i >= 0; --i) {
          result = results[i]; // Check if import matching does no concerne inner class

          if (exports.includes(result)) {
            return;
          }

          if (!result) {
            results.splice(i, 1);
          }
        }

        if (results.length > 0) {
          Array.prototype.push.apply(statements, results);
        }
      });
      return statements;
    }
  }, {
    key: "_getAllExtendsStatementIn",
    value: function _getAllExtendsStatementIn(namespace, file, exports) {
      var statements = []; // By Object.assign

      var fileRegex = new RegExp("Object\\.assign\\(\\s*((".concat(namespace, ".)?(\\w+)\\.prototype[,]*\\s*){2,}"), 'g');
      var namespaceRegex = new RegExp("".concat(namespace, "\\."), 'g');
      var matchs = file.match(fileRegex) || [];
      matchs.filter(makeUnique).forEach(function (value) {
        var results = value.replace(/Object\.assign\(\s+/g, '').replace(namespaceRegex, '').replace(/\.prototype/g, '').replace(/\s+/g, '').split(','); // Check if the extends statement is not about the exported object !

        var result = undefined;

        for (var i = results.length - 1; i >= 0; --i) {
          result = results[i]; // Check if import matching does no concerne inner class

          if (!result || exports.includes(result)) {
            results.splice(i, 1);
          }
        }

        if (results.length > 0) {
          Array.prototype.push.apply(statements, results);
        }
      });
      return statements;
    }
  }, {
    key: "_getAllInheritStatementsIn",
    value: function _getAllInheritStatementsIn(namespace, file, exports) {
      var statements = [];
      var fileRegex = new RegExp("Object\\.create\\(\\s+((".concat(namespace, ".)?(\\w+)\\.prototype[,]?\\s*)+\\)"), 'g');
      var namespaceRegex = new RegExp("Object\\.create\\(\\s+(".concat(namespace, ".)?"), 'g');
      var matchs = file.match(fileRegex) || [];
      matchs.filter(makeUnique).forEach(function (value) {
        var results = value.replace(namespaceRegex, '').replace(/\.prototype/g, '').replace(/\)/g, '').replace(/\s+/g, '').split(','); // Check if the inherit statement is not about the exported object !

        var result = undefined;

        for (var i = 0, resultLength = results.length; i < resultLength; i++) {
          result = results[i];

          if (!result || exports.includes(result)) {
            results.splice(i, 1);
          }
        }

        if (results.length > 0) {
          Array.prototype.push.apply(statements, results);
        }
      });
      return statements;
    }
  }, {
    key: "_getAllNewStatementIn",
    value: function _getAllNewStatementIn(namespace, file, exports) {
      var statements = [];
      var fileRegex = new RegExp("new\\s".concat(namespace, ".(\\w+)\\s?"), 'g');
      var namespaceRegex = new RegExp("new\\s".concat(namespace, "\\."), 'g');
      var matchs = file.match(fileRegex) || [];
      matchs.filter(makeUnique).forEach(function (value) {
        var result = value.replace(namespaceRegex, '').replace(/\s+/g, ''); // Check if the new statement is not about the exported object !

        if (exports.includes(result)) {
          return;
        }

        if (result) {
          statements.push(result);
        }
      });
      return statements;
    }
  }, {
    key: "_getAllInstanceOfStatementIn",
    value: function _getAllInstanceOfStatementIn(namespace, file, exports) {
      var statements = [];
      var fileRegex = new RegExp("instanceof\\s".concat(namespace, ".(\\w+)\\s?"), 'g');
      var namespaceRegex = new RegExp("instanceof\\s".concat(namespace, "\\."), 'g');
      var matchs = file.match(fileRegex) || [];
      matchs.filter(makeUnique).forEach(function (value) {
        var result = value.replace(namespaceRegex, '').replace(/\s+/g, ''); // Check if the new statement is not about the exported object !

        if (exports.includes(result)) {
          return;
        }

        if (result) {
          statements.push(result);
        }
      });
      return statements;
    }
  }, {
    key: "_getImportsFor",
    value: function _getImportsFor(namespace, file, exports, edgeCase) {
      if (edgeCase.importsOverride) {
        return edgeCase.importsOverride;
      }

      var imports = [];
      Array.prototype.push.apply(imports, JsToEs._getAllImportsStatementIn(namespace, file, exports));
      Array.prototype.push.apply(imports, JsToEs._getAllInheritStatementsIn(namespace, file, exports));
      Array.prototype.push.apply(imports, JsToEs._getAllExtendsStatementIn(namespace, file, exports));
      Array.prototype.push.apply(imports, JsToEs._getAllNewStatementIn(namespace, file, exports));
      Array.prototype.push.apply(imports, JsToEs._getAllInstanceOfStatementIn(namespace, file, exports));

      if (edgeCase.imports) {
        Array.prototype.push.apply(imports, edgeCase.imports);
      } // A class can be inherited and dynamicaly create by new in the same file so we need to check uniqueness


      return imports.filter(makeUnique);
    }
  }, {
    key: "_formatImportStatements",
    value: function _formatImportStatements(importerFilePath, exportMap, objectNames) {
      var importStatements = [];
      var importsMap = {};
      objectNames.forEach(function (objectName) {
        if (Array.isArray(objectName)) {
          importsMap[objectName[2]] = [];
          importsMap[objectName[2]].push(objectName[0]);
        } else {
          var exporterFilePath = exportMap[objectName];

          if (!exporterFilePath) {
            console.error("WARNING: Missing export statement for: ".concat(objectName, " in ").concat(importerFilePath, " this is an edge case that will probably need to be managed manually !!!"));
            return;
          } // Compute relative path from importer to exporter


          var importerDirectoryName = path.dirname(importerFilePath);
          var exporterDirectoryName = path.dirname(exporterFilePath);
          var exporterBaseName = path.basename(exporterFilePath);
          var relativePath = path.relative(importerDirectoryName, exporterDirectoryName);
          var firstChar = relativePath[0];
          var notStartWithDot = firstChar !== '.';
          var relativeFilePath = notStartWithDot ? './' + path.join(relativePath, exporterBaseName) : path.join(relativePath, exporterBaseName);
          var relativeFilePathNormalized = relativeFilePath.replace(/\\/g, '/');

          if (!importsMap[relativeFilePathNormalized]) {
            importsMap[relativeFilePathNormalized] = [];
          }

          importsMap[relativeFilePathNormalized].push(objectName);
        }
      });

      for (var importPath in importsMap) {
        var imports = importsMap[importPath];
        var formatedImports = 'import {';

        if (imports.length === 1) {
          formatedImports += " ".concat(imports[0], " ");
        } else if (imports.length > 1) {
          formatedImports += '\n';
          var importedObject = undefined;

          for (var i = 0, numberOfImports = imports.length; i < numberOfImports; i++) {
            importedObject = imports[i];

            if (i === numberOfImports - 1) {
              formatedImports += "\t".concat(importedObject, "\n");
            } else {
              formatedImports += "\t".concat(importedObject, ",\n");
            }
          }
        } else {
          console.error("WARNING: ".concat(path.basename(importPath), " does not contains imports, fallback to file name export..."));
        }

        formatedImports += "} from '".concat(importPath, "'");
        importStatements.push(formatedImports);
      }

      return importStatements.join('\n').concat('\n\n'); // don't forget last feed line
    }
  }, {
    key: "_getEs6ReplacementsFor",
    value: function _getEs6ReplacementsFor(namespace) {
      var replacements = [];
      replacements.push([/import\s+(?:(?:({[\w\s,]+})|([\w,*-]+))\s+)+from.+/g, '']);
      replacements.push([/export var/g, 'var']);
      replacements.push([/export function/g, 'function']);
      replacements.push([/export(?:[^s]|)(\s*{(?:[\w\s,])+}\s*)(?:(?:from)?\s?['"][./]+[\w.]+['"])?;?/g, '']);
      return replacements;
    }
  }, {
    key: "_getExportsReplacementsFor",
    value: function _getExportsReplacementsFor(namespace, exports) {
      var replacements = [];

      for (var i = 0, numberOfExports = exports.length; i < numberOfExports; i++) {
        var exportedObject = exports[i];
        var regex2 = new RegExp("".concat(namespace, ".").concat(exportedObject, " ="), 'g');
        var replacement2 = "var ".concat(exportedObject, " =");
        replacements.push([regex2, replacement2]);
        var regex1 = new RegExp(' = var ', 'g');
        var replacement1 = ' = ';
        replacements.push([regex1, replacement1]);
      }

      return replacements;
    }
  }, {
    key: "_getIifeReplacementsFor",
    value: function _getIifeReplacementsFor(namespace, file) {
      var unspacedFile = file.replace(/\s+/g, '');
      var replacements = []; // Check if this iife is a main englobing function or inner function

      var matchIife = unspacedFile.match(/^\(\s*function\s*\(\s*(\w+)?\s*\)\s*\{/g) || [];

      if (matchIife.length > 0) {
        replacements.push([/\(\s*function\s*\(\s*(\w+)?\s*\)\s*\{/, '']); // Check for end type with params or not

        var matchParametrizedEndIife = unspacedFile.match(/}\s*\)\s*\(\s*[\w.=\s]*(\|\|\s*\{\})?\s*\);?$/) || [];
        var matchEmptyEndIife = unspacedFile.match(/}\s*\(\s*[\w]*\s*\)\s*\);?$/) || [];

        if (matchParametrizedEndIife.length > 0) {
          replacements.push([/}\s*\)\s*\(\s*[\w.=\s]*(\|\|\s*\{\})?\s*\);?/, '']);
        } else if (matchEmptyEndIife.length > 0) {
          replacements.push([/}\s*\(\s*[\w]*\s*\)\s*\);?/, '']);
        } else {
          throw new Error('Unable to match end of IIFE.');
        }
      }

      return replacements;
    }
  }, {
    key: "_getNamespaceReplacementsFor",
    value: function _getNamespaceReplacementsFor(namespace) {
      var regex1 = new RegExp("".concat(namespace, "\\.Math\\."), 'g');
      var regex2 = new RegExp("".concat(namespace, "."), 'g');
      return [[regex1, '_Math.'], [regex2, '']];
    }
  }, {
    key: "_getAutoAssignementReplacementsFor",
    value: function _getAutoAssignementReplacementsFor(namespace) {
      return [[/var\s?(\w+)\s?=\s?\1;/g, '']];
    }
  }, {
    key: "_getReplacementsFor",
    value: function _getReplacementsFor(namespace, file, exports, edgeCase) {
      if (edgeCase.replacementsOverride) {
        return edgeCase.replacementsOverride;
      }

      var replacements = [];
      Array.prototype.push.apply(replacements, JsToEs._getEs6ReplacementsFor(namespace));
      Array.prototype.push.apply(replacements, JsToEs._getExportsReplacementsFor(namespace, exports));
      Array.prototype.push.apply(replacements, JsToEs._getIifeReplacementsFor(namespace, file));
      Array.prototype.push.apply(replacements, JsToEs._getNamespaceReplacementsFor(namespace));
      Array.prototype.push.apply(replacements, JsToEs._getAutoAssignementReplacementsFor(namespace));

      if (edgeCase.replacements) {
        Array.prototype.push.apply(replacements, edgeCase.replacements);
      }

      return replacements;
    }
  }, {
    key: "_formatReplacementStatements",
    value: function _formatReplacementStatements(file, replacements) {
      var _file = file;

      for (var replaceIndex = 0, numberOfReplacements = replacements.length; replaceIndex < numberOfReplacements; replaceIndex++) {
        var replacement = replacements[replaceIndex];
        _file = _file.replace(replacement[0], replacement[1]);
      }

      return _file;
    }
  }, {
    key: "_getExportsStatementsInES6File",
    value: function _getExportsStatementsInES6File(namespace, file) {
      var exportedElements = []; // Todo: May be it should be splitted by export type... direct, named, default, as etc...

      var es6MatchedExports = file.match(/export(?:[^s]|)(?:(?:\s*{([\w\s,]+)}\s*)(?:(?:from)?\s?['"]([./]+[\w.]+['"]);?)?|(var\s+.+))/g);

      if (es6MatchedExports) {
        // Clean
        es6MatchedExports.forEach(function (value) {
          if (value.contains('from')) {
            var splitOnFrom = value.split('from');
            var exports = splitOnFrom[0].replace(/export/g, '').replace(/[\s\n\r;{}]+/g, ''); //                    .split( ',' )

            var exportFile = splitOnFrom[1].replace(/[\s'";]+/g, ''); // Todo: allow exports like 'foo, bar, baz' and parse it when create exports statements

            Array.prototype.push.apply(exportedElements, [[exports, 'from', exportFile]]);
            return;
          }

          if (value.contains('as')) {
            value = value.replace(/\w+\sas/g, '');
          }

          if (value.contains('var')) {
            value = value.replace(/export/g, '').replace(/var/g, '').replace(/\s*=\s*.+/g, '');
          }

          if (value.contains('function')) {
            value = value.replace(/function/g, '');
          }

          var results = value.replace(/export/g, '').replace(/[\s\n\r;{}]+/g, '').split(',');
          Array.prototype.push.apply(exportedElements, results);
        });
      }

      return exportedElements;
    }
  }, {
    key: "_getExportsStatementsInAMDFile",
    value: function _getExportsStatementsInAMDFile(namespace, file) {
      console.error("WARNING: File is unable to be process... It is an AMD module. Sorry for the disagreement.");
      return [];
    }
  }, {
    key: "_getExportsStatementsInCJSFile",
    value: function _getExportsStatementsInCJSFile(namespace, file) {
      var exportedElements = [];
      var fileRegex = new RegExp(/module\.exports\s*=\s*\{?[^}]*}?/g);
      var commonjsExports = file.match(fileRegex);

      if (commonjsExports) {
        // Clean
        commonjsExports.forEach(function (value) {
          var results = value.replace(/module\.exports/g, '').replace(/[\s\n\r;{}=]+/g, '').split(',');
          Array.prototype.push.apply(exportedElements, results);
        });
      }

      return exportedElements;
    }
  }, {
    key: "_getExportsStatementsInClassicFile",
    value: function _getExportsStatementsInClassicFile(namespace, file) {
      var exportedElements = [];
      var fileRegex = new RegExp("(".concat(namespace, ".(\\w+)\\s*=\\s*)+\\s*function"), 'g');
      var namespaceRegex = new RegExp("".concat(namespace, "\\.|\\s*=\\s*function"), 'g');
      var potentialClassicObjectExports = file.match(fileRegex);

      if (potentialClassicObjectExports) {
        // Clean
        potentialClassicObjectExports.forEach(function (value) {
          var results = value.replace(namespaceRegex, '').replace(/\s*/g, '').split('=');
          Array.prototype.push.apply(exportedElements, results);
        });
      }

      return exportedElements;
    }
  }, {
    key: "_getExportsStatementsInPrototypedFile",
    value: function _getExportsStatementsInPrototypedFile(namespace, file) {
      var exportedElements = [];
      var fileRegex = new RegExp("prototype\\.constructor\\s?=\\s?(".concat(namespace, "\\.)?(\\w)+"), 'g');
      var namespaceRegex = new RegExp("".concat(namespace, "\\."), 'g');
      var potentialPrototypedObjectExports = file.match(fileRegex);

      if (potentialPrototypedObjectExports) {
        // Clean
        potentialPrototypedObjectExports.forEach(function (value) {
          var result = value.replace(/prototype\.constructor\s?=\s?/g, '').replace(namespaceRegex, '');
          exportedElements.push(result);
        });
      }

      return exportedElements;
    }
  }, {
    key: "_getExportsStatementInLibraryFile",
    value: function _getExportsStatementInLibraryFile(namespace, file) {
      var exportedElements = [];
      var fileRegex = new RegExp("".concat(namespace, ".(\\w+) = \\{"), 'g');
      var namespaceRegex = new RegExp("".concat(namespace, "\\.| = \\{"), 'g');
      var potentialLibExports = file.match(fileRegex);

      if (potentialLibExports) {
        // Clean
        potentialLibExports.forEach(function (value) {
          var result = value.replace(namespaceRegex, '');
          exportedElements.push(result);
        });
      }

      return exportedElements;
    }
  }, {
    key: "_getExportsFor",
    value: function _getExportsFor(namespace, fileType, file, baseName, edgeCase) {
      if (edgeCase.exportsOverride) {
        return edgeCase.exportsOverride;
      }

      var exports = undefined;

      switch (fileType) {
        case JsToEs.JavascriptType.AMD:
          exports = JsToEs._getExportsStatementsInAMDFile(namespace, file);
          break;

        case JsToEs.JavascriptType.CJS:
          exports = JsToEs._getExportsStatementsInCJSFile(namespace, file);
          break;

        case JsToEs.JavascriptType.Classic:
          exports = JsToEs._getExportsStatementsInClassicFile(namespace, file);
          break;

        case JsToEs.JavascriptType.Es6:
          exports = JsToEs._getExportsStatementsInES6File(namespace, file);
          break;

        case JsToEs.JavascriptType.Library:
          exports = JsToEs._getExportsStatementInLibraryFile(namespace, file);
          break;

        case JsToEs.JavascriptType.Prototype:
          exports = JsToEs._getExportsStatementsInPrototypedFile(namespace, file);
          break;

        case JsToEs.JavascriptType.UMD:
        case JsToEs.JavascriptType.Unknown:
          console.error("WARNING: ".concat(baseName, " does not contains explicit or implicit export, fallback to file name as export..."));
          exports = [baseName];
          break;

        default:
          throw new RangeError("Invalid switch parameter: ".concat(fileType));
          break;
      }

      if (edgeCase.exports) {
        Array.prototype.push.apply(exports, edgeCase.exports);
      }

      return exports.filter(makeUnique);
    }
  }, {
    key: "_formatExportStatements",
    value: function _formatExportStatements(filePath, exports) {
      // Formating
      var formatedExports = ''; // First check for specified exports

      var specificExports = [];
      var regularExports = [];
      exports.forEach(function (exports) {
        Array.isArray(exports) ? specificExports.push(exports) : regularExports.push(exports);
      });

      if (specificExports.length === 0 && regularExports.length === 0) {
        console.error("WARNING: ".concat(path.basename(filePath), " does not contains explicit or implicit export, fallback to file name export... It must be an Es6 file with it own exports !"));
        return '';
      } // Process specific exports


      for (var i = 0, numbSpecExp = specificExports.length; i < numbSpecExp; i++) {
        var _exports = specificExports[i];
        var exportedClass = _exports[0];
        var exportAction = _exports[1];
        var exportComplement = _exports[2];

        if (exportAction === 'from') {
          formatedExports += "export { ".concat(_exports[0], " } from \"").concat(exportComplement, "\"\n");
        } else if (exportAction === 'as') {
          formatedExports += "export { ".concat(_exports[0], " as ").concat(exportComplement, " }\n");
        } else {
          // Todo: export { Foo as Bar } from 'Baz'
          throw new Error('Invalid specified export action !');
        }
      } // Process regular exports


      var numberOfExports = regularExports.length;

      if (numberOfExports === 1) {
        formatedExports += "\nexport { ".concat(exports[0], " }\n");
      } else if (numberOfExports > 1) {
        formatedExports += '\nexport {\n';

        for (var _i = 0; _i < numberOfExports; _i++) {
          formatedExports += _i === numberOfExports - 1 ? '\t' + regularExports[_i] + '\n' : '\t' + regularExports[_i] + ',\n';
        }

        formatedExports += '}\n';
      }

      return formatedExports;
    }
  }, {
    key: "_getOutputFor",
    value: function _getOutputFor(filePath, inputs, outputBasePath, edgeCase) {
      if (edgeCase.outputOverride) {
        return path.join(outputBasePath, edgeCase.outputOverride);
      }

      var specificPath = JsToEs._getSpecificPath(inputs, outputBasePath, filePath);

      var outputPath = path.join(outputBasePath, specificPath);
      return outputPath;
    }
  }, {
    key: "_getSpecificPath",
    value: function _getSpecificPath(baseInputs, baseOutput, target) {
      var targetSplits = target.split(path.sep);
      var indexMax = 0;

      for (var i = 0, numInputs = baseInputs.length; i < numInputs; i++) {
        var baseinputSplits = baseInputs[i].split(path.sep);
        var index = 0;

        while (baseinputSplits[index] === targetSplits[index]) {
          index++;
        }

        if (index > indexMax) {
          indexMax = index;
        }
      }

      var specificPath = targetSplits.slice(indexMax).join(path.sep);
      return specificPath;
    }
  }, {
    key: "_createFilesMap",
    value: function _createFilesMap(namespace, regex, filesPaths, edgeCases, inputs, outputBasePath) {
      var filesMap = {};
      filesPaths.forEach(function (filePath) {
        var fileExtension = path.extname(filePath);
        var baseName = path.basename(filePath, fileExtension);

        if (filesMap[baseName]) {
          console.error("WARNING: The file ".concat(baseName, " already exist in the file map ! Is there a duplicated file ???"));
          return;
        }

        var file = getUncommentedFileForPath(filePath);
        var isJavascript = fileExtension === '.js';
        var edgeCase = edgeCases[baseName] || {};

        if (isJavascript) {
          var fileType = JsToEs._getFileType(file, regex);

          var exports = JsToEs._getExportsFor(namespace, fileType, file, baseName, edgeCase);

          var imports = JsToEs._getImportsFor(namespace, file, exports, edgeCase);

          var replacements = JsToEs._getReplacementsFor(namespace, file, exports, edgeCase);

          var output = JsToEs._getOutputFor(filePath, inputs, outputBasePath, edgeCase);

          filesMap[baseName] = {
            isJavascript: isJavascript,
            fileType: fileType,
            file: file,
            imports: imports,
            replacements: replacements,
            exports: exports,
            output: output
          };
        } else {
          var _output = JsToEs._getOutputFor(filePath, inputs, outputBasePath, edgeCase);

          filesMap[baseName] = {
            isJavascript: isJavascript,
            file: file,
            output: _output
          };
        }
      });
      return filesMap;
    }
  }, {
    key: "_createExportMap",
    value: function _createExportMap(filesPaths, namespace, regex, edgeCases, inputs, outputBasePath) {
      var exportsMap = {};
      filesPaths.forEach(function (filePath) {
        var fileExtension = path.extname(filePath);
        var baseName = path.basename(filePath, fileExtension);
        var edgeCase = edgeCases[baseName] || {};
        var file = getUncommentedFileForPath(filePath);

        var fileType = JsToEs._getFileType(file, regex);

        var exports = JsToEs._getExportsFor(namespace, fileType, file, baseName, edgeCase);

        var outputPath = JsToEs._getOutputFor(filePath, inputs, outputBasePath, edgeCase);

        exports.forEach(function (exportedElement) {
          // Check case where export is an array with 'from' or 'as'
          if (Array.isArray(exportedElement)) {
            exportedElement = exportedElement[0];
          }

          var exportPath = exportsMap[exportedElement];

          if (exportPath) {
            var exportName = path.basename(exportPath);
            var fileName = path.basename(filePath);
            console.error("WARNING: Element \"".concat(exportedElement, "\" in ").concat(fileName, " is already exported by source ").concat(exportName, "! Unable to determine which source file is the right exporter !!!"));
            return;
          }

          exportsMap[exportedElement] = outputPath;
        });
      });
      return exportsMap;
    }
  }, {
    key: "_processFiles",
    value: function _processFiles(fileMap, exportMap, banner) {
      for (var fileName in fileMap) {
        if (!fileMap.hasOwnProperty(fileName)) {
          continue;
        }

        var fileData = fileMap[fileName];

        if (fileData.isJavascript) {
          JsToEs._convertFile(banner, fileData, exportMap);
        } else {
          JsToEs._copyFile(banner, fileData);
        }
      }
    }
  }]);

  return JsToEs;
}();

_defineProperty(JsToEs, "JavascriptType", Object.freeze({
  AMD: 'AMD',
  CJS: 'CJS',
  Classic: 'Classic',
  Es6: 'Es6',
  Library: 'Library',
  Prototype: 'Prototype',
  UMD: 'UMD',
  Unknown: 'Unknown'
}));

exports.JsToEs = JsToEs;
