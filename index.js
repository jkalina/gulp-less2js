'use strict';

var through2 = require('through2'),
    gutil = require('gulp-util'),
    less = require('less'),
    path = require('path'),
    assign = require('object-assign'),

    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-less2js';

var convertToCamelcase = function (input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group) {
        return group.toUpperCase();
    });
};

module.exports = function (options) {

    options = assign({}, {
        compress: false,
        paths: []
    }, options);

    return through2.obj(function (file, enc, cb) {

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        var str = file.contents.toString(),
            opts = assign({}, options),
            lessVars = {};

        opts.filename = file.path;

        var parser = new less.Parser({
            syncImport: true,
            paths: path.dirname(path.resolve(opts.filename)),
            filename: path.basename(opts.filename)
        });

        parser.parse(str, function (err, tree) {
            var env = new less.tree.evalEnv();
            var ruleset = tree.eval(env);
            var prefix = options.ignoreWithPrefix || null;

            ruleset.rules.forEach(function (rule) {
                if (rule.variable) {

                    var name;
                    
                    if (options.camelCase === false) {
                        name = rule.name.substr(1);
                    } else {
                        name = convertToCamelcase(rule.name.substr(1));
                    }

                    if (!prefix || name.substr(0, prefix.length) !== prefix) {
                        var value = rule.value.value[0];
                        lessVars[name] = value.toCSS();
                    }
                }
            });

        });

        file.contents = new Buffer(JSON.stringify(lessVars, null, 2));
        cb(null, file);

    });
};