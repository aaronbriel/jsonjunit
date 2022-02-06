var xml = require('xml'),
    path = require('path'),
    fs = require('fs'),
    diff= require('diff'),
    junitXml;

/**
 * [exports description]
 * @method exports
 * @param  {[type]} jsonPath [path to json file]
 * @return {[type]} junitPath [path to junit file]
 */
module.exports = {

    convertJson : function (jsonPath, junitPath, options) {
        var jsonData,
            jsonRaw,
            jsonType;

        //setting optional arguments
        options = options || {};
        jsonType = options.jsonType || 'mochawesome';

        jsonRaw = fs.readFileSync(jsonPath, 'utf8');
        junitXml = fs.openSync(junitPath, 'w');


        if (jsonRaw && jsonRaw.toString().trim() !== '') {
            jsonData = JSON.parse(jsonRaw);

            if (jsonType == 'mochawesome') {

                //Formatting start time to javascript date then extracting milliseconds
                //for later timestamp incrementation
                var dateFormatted = new Date(jsonData.stats.start),
                    dateMilliseconds = dateFormatted.getTime(),
                    suites = jsonData.results[0].suites;

                writeString('<testsuites name="' + jsonData.reportTitle + '">\n');

                suites.forEach(function (suite) {

                    var testCount = 0,
                        failures = 0,
                        skips = 0,
                        duration = 0;

                    var tests = suite.tests;

                    tests.forEach(function (test) {
                        testCount++;
                        duration = duration + test.duration;
                        if (test.fail == true) failures++;
                        if (test.skipped == true) skips++;
                    });

                    //incrementing millisecond timestamp by adding duration of all tests in order
                    //to correctly input testsuite 'timestamp' value
                    dateMilliseconds = dateMilliseconds + duration;

                    var dateTimestamp = new Date(dateMilliseconds);

                    writeString('<testsuite');
                    writeString(' name="' + htmlEscape(suite.title) + '"');
                    writeString(' tests="' + testCount + '"');
                    writeString(' failures="' + failures + '"');
                    writeString(' skipped="' + skips + '"');
                    writeString(' timestamp="' + dateTimestamp.toUTCString() + '"');
                    writeString(' time="' + (duration / 1000) + '"');
                    writeString('>\n');

                    tests.forEach(function (test) {
                        writeString('<testcase');
                        writeString(' classname="' + htmlEscape(suite.title) + '"');
                        writeString(' name="' + htmlEscape(test.title) + '"');
                        writeString(' time="' + (test.duration / 1000) + '">\n');
                        if (test.state == "failed") {
                            writeString('<failure message="');
                            if (test.err.message) writeString(htmlEscape(test.err.message));
                            writeString('">\n');
                            writeString(htmlEscape(unifiedDiff(test.err)));
                            writeString('\n</failure>\n');

                        } else if (test.state === undefined) {
                            writeString('<skipped/>\n');
                        }

                        //TODO : extract console output to leverage this logic
                        //if (test.logEntries && test.logEntries.length) {
                        //    writeString('<system-out><![CDATA[');
                        //    test.logEntries.forEach(function (entry) {
                        //        var outstr = util.format.apply(util, entry) + '\n';
                        //        outstr = removeInvalidXmlChars(outstr);
                        //        // We need to escape CDATA ending tags inside CDATA
                        //        outstr = outstr.replace(/]]>/g, ']]]]><![CDATA[>')
                        //        writeString(outstr);
                        //    });
                        //    writeString(']]></system-out>\n');
                        //}

                        writeString('</testcase>\n');
                    });

                    writeString('</testsuite>\n');
                });

                writeString('</testsuites>\n');
                if (junitXml) fs.closeSync(junitXml);
            }

        } else {
            console.log("Unable to parse json file.")
            process.exit(1);
        }
    }

}

//the following methods were inspired by and/or borrowed from mocha-jenkins-reporter

function writeString(str) {
    if (junitXml) {
        var buf = new Buffer(str);
        fs.writeSync(junitXml, buf, 0, buf.length, null);
    }
}

function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


function unifiedDiff(err) {
    function escapeInvisibles(line) {
        return line.replace(/\t/g, '<tab>')
            .replace(/\r/g, '<CR>')
            .replace(/\n/g, '<LF>\n');
    }
    function cleanUp(line) {
        if (line.match(/\@\@/)) return null;
        if (line.match(/\\ No newline/)) return null;
        return escapeInvisibles(line);
    }
    function notBlank(line) {
        return line != null;
    }

    var actual = err.actual,
        expected = err.expected;

    var lines, msg = '';

    if (err.actual && err.expected) {
        // make sure actual and expected are strings
        if (!(typeof actual === 'string' || actual instanceof String)) {
            actual = JSON.stringify(err.actual);
        }

        if (!(typeof expected === 'string' || expected instanceof String)) {
            expected = JSON.stringify(err.actual);
        }

        msg = diff.createPatch('string', actual, expected);
        lines = msg.split('\n').splice(4);
        msg += lines.map(cleanUp).filter(notBlank).join('\n');
    }

    //TODO: Leverage if needed
    //if (options.junit_report_stack && err.stack) {
    //    if (msg) msg += '\n';
    //    lines = err.stack.split('\n').slice(1);
    //    msg += lines.map(cleanUp).filter(notBlank).join('\n');
    //}

    return msg;
}