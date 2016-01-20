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
  var currentEditor, outputPath, projectMainLess, mainFiles, currentFilePath;
  currentEditor = atom.workspace.getActiveTextEditor();
  if (currentEditor) {
    currentFilePath = currentEditor.getPath();
    if (currentFilePath.substr(-4) === "less") {
      outputPath = atom.project.getPaths() + atom.config.get('atom-compile-less.outputFolder');
      projectMainLess = atom.config.get('atom-compile-less.mainLessFile');
      mainFiles = projectMainLess.split(',');
      for (i=0;i<mainFiles.length; i++){
        var file = atom.project.getPaths() + (mainFiles[i]).trim();
        console.log(file);
        compileFile(file, outputPath);
      }
    }
    return global.Function = Function;

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
      default: '/assets/less/xenon-components.less,/assets/less/xenon.less'
    },
    showSuccessMessage: {
      type: 'boolean',
      default: true
    },
    outputFolder: {
      type: 'string',
      default: '/assets/css/'
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
