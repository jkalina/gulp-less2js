# gulp-less2js
This plugin converts variables from less stylesheets to JSON, to enable using them in JavaScripts. 
It uses some code taken from [grunt-less2js](https://github.com/ixrock/grunt-less2js), but has some different configuration options
(it doesn't support creating file formats different than JSON, so the unnecessary options were ignored). 


## Getting Started
Install plugin as dependency using:
```
npm install gulp-less2js --save-dev
```

## Using gulp-less2js task
In the most basic case **gulp-less2js** converts variables given in LESS stylesheet and changes their names to camelcase.  

Running task:

```
gulp.task('extractLessVariables', function () {
    return gulp.src(SOURCE_FILE)
        .pipe($.less2js())
        .pipe(gulp.dest(DESTINATION_PATH));
});
```

will cause converting such file:

```less
@test-color: red; 
```

into:

```json
{
  "testColor": "#ff0000"
}
```

### Options:

#### options.camelCase
- Type: `Bool`
- Default value: `true`

By default all variable names are converted to camelcase notation. It can be disabled by setting this option to `false`. 

#### options.ignoreWithPrefix
- Type: `String`
- Default value: `''`

If a variable starts with the ignoreWithPrefix, it will be omitted from the JSON file.
For example: `_` would ignore `@_base`.