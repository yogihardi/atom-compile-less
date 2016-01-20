var Function, atomCompileLess, compileFile, fs, getFileContents, less, path;

less = require("less");
fs = require("fs");
path = require("path");

Function = require("loophole").Function;

getFileContents = function(filePath, callback) {
  var content, read;
  content = '';
  return fs.readFile(filePath, 'utf-8', read = function(err, data) {
    if (err) {
      throw err;
    }
    return callback(data);
  });
};

compileFile = function(filepath,outputPath) {
  var outputCompressed, showSuccessMessage;
  outputCompressed = atom.config.get('atom-compile-less.compressCss');
  showSuccessMessage = atom.config.get('atom-compile-less.showSuccessMessage');
 
  return getFileContents(filepath, function(content) {
    var parser;
    if (!content) {
      throw err;
    }
    parser = new less.Parser({
      paths: [path.dirname(filepath)]
    });
    return parser.parse(content, (function(_this) {
      return function(err, parsedContent) {
        var cssFilePath, outputCss, cssFilename, path;
        if (err) {
          throw err;
        }
        outputCss = parsedContent.toCSS({
          compress: outputCompressed
        });
        cssFilePath = filepath.replace(".less", ".css");
        
        cssFilename = cssFilePath.split('/');
        cssFilename = cssFilename[cssFilename.length - 1];
        cssFilePath = outputPath + '/' + cssFilename;
        console.log(cssFilePath);
        return fs.writeFile(cssFilePath, outputCss, function(err) {
          var fileName, message;
          if (showSuccessMessage) {
            fileName = cssFilePath.split('/');
            fileName = fileName[fileName.length - 1];
            message = 'File <strong>' + fileName + '</strong> compiled! yeeeey!';
            return atom.notifications.addSuccess(message);
          }
        });
      };
    })(this));
  });
};

atomCompileLess = function() {
  var currentEditor, currentFilePath, includeMainFile, projectMainLess, projectPath, outputPath;
  currentEditor = atom.workspace.getActiveTextEditor();
  if (currentEditor) {
    currentFilePath = currentEditor.getPath();
    if (currentFilePath.substr(-4) === "less") {
      projectPath = atom.project.getPaths();
      projectMainLess = atom.project.getPaths() + '/' + atom.config.get('atom-compile-less.mainLessFile');
      outputPath = atom.project.getPaths() + atom.config.get('atom-compile-less.outputFolder');
      console.log(atom.config.get('atom-compile-less.mainLessFile'));
      includeMainFile = atom.config.get('atom-compile-less.compileMainFile');
      compileFile(currentFilePath,outputPath);
      if (includeMainFile) {
        compileFile(projectMainLess,outputPath);
      }
      return global.Function = Function;
    }
  }
};

module.exports = {
  config: {
    compressCss: {
      type: 'boolean',
      default: true
    },
    mainLessFile: {
      type: 'string',
      default: 'main.less'
    },
    compileMainFile: {
      type: 'boolean',
      default: true
    },
    showSuccessMessage: {
      type: 'boolean',
      default: true
    },
    outputFolder: {
      type: 'string',
      default: '../css'
    }
  },

  activate: (function(_this) {
    return function(state) {
      return atom.workspace.observeTextEditors(function(editor) {
        return editor.onDidSave((function(_this) {
          return function() {
            return atomCompileLess();
          };
        })(this));
      });
    };
  })(this),
  deactivate: function() {},
  serialize: function() {}
};
