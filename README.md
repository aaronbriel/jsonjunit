JSON to JUnitXML Converter
======================

This converter is useful if you are using a Jenkins reporter that publishes a json test result but does not publish JUnitXML and hence does not display test trend data. It is currently written to work with [mochawesome](https://www.npmjs.com/package/mochawesome) reporter.

It accepts parameters for the path to json files and the destination path for converted JUnitXML files. It creates the JUnitXML file with the same base name as the JSON file it is converting.  There is also a `jsontype` optional parameter which is currently dormant until additional JSON types aside from `mochawesome` are incorporated.

## Install

json-junit should be added to your test codebase as a dev dependency.  You can do this with:

``` shell
$ npm install --save-dev jsonjunit
```

Alternatively, you can manually add it to your package.json file:

``` json
{
  "devDependencies" : {
    "jsonjunit": "latest"
  }
}
```

then install with:

``` shell
$ npm install --dev
```

## Run

``` shell
$ node_modules/.bin/jsonjunit --json PATH_TO_JSON --junit PATH_TO_JUNITXML
```

where PATH_TO_JSON is a path from your current working directory to the JSON files you wish to convert, and PATH_TO_JUNITXML is a path to the directory where you wish to create the converted JUnitXML files.


License
-------

```
Copyright (c) 2016 Aaron Briel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```