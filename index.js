#!/usr/bin/env node
var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    pkg = require('./package.json'),
    jsonJunit = require('./lib/jsonjunit'),
    fileName,
    jsonFile,
    junitFile;

program
    .version(pkg.version)
    .option('-ju, --json <json>', 'JSON report target path')
    .option('-jx, --junit <junit>', 'JUnitXML report destination path')
    //.option('-jt, --jsontype', 'Type of JSON report to convert')
    .parse(process.argv);

if (!program.json || !program.junit) {
    console.log('You must specify both JSON and JUNIT path!');
    process.exit(1);
} else {
    //create JUnitXML report dir if it doesn't exist
    if (!fs.existsSync(program.junit)) {
        fs.mkdirSync(program.junit);
    }

    var jsonFiles = fs.readdirSync(program.json);

    for(var i in jsonFiles) {
        if (jsonFiles[i].indexOf('.json')>-1) {
            jsonFile = path.join(program.json, jsonFiles[i]);
            fileName = jsonFiles[i].slice(0, jsonFiles[i].indexOf('.json'));
            junitFile = path.join(program.junit, fileName + ".xml");
            jsonJunit.convertJson(jsonFile, junitFile);
        }
    }
}
