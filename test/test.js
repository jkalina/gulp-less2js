'use strict';

var should = require('should'),
    less = require('../'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    pj = require('path').join;

var createVinyl = function (lessFileName, contents) {
    var base = pj(__dirname, 'fixtures');
    var filePath = pj(base, lessFileName);

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: contents || fs.readFileSync(filePath)
    });
}

describe('gulp-less2js', function () {
    describe('in buffer mode', function () {

        it('should create json object from given less file', function (done) {

            var lessFile = createVinyl('variables.less');

            var stream = less();
            stream.once('data', function (jsonFile) {
                should.exist(jsonFile);
                should.exist(jsonFile.path);
                should.exist(jsonFile.relative);
                should.exist(jsonFile.contents);
                String(jsonFile.contents).should.equal(
                    fs.readFileSync(pj(__dirname, 'expect/variables.json'), 'utf8'));
                done();
            });
            stream.write(lessFile);
            stream.end();
        });

    });
});