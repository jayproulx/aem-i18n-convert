#!/usr/bin/env node

const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const STANDARD_LABEL_CHAR_MAPPING = ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "-", "_", "_", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", "_", "_", "_", "_", "_", "_", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "_", "_", "_", "_", "_", "_", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "_", "_", "_", "_", "_", "_", "f", "_", "_", "_", "fi", "fi", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "y", "_", "_", "_", "_", "i", "c", "p", "o", "v", "_", "s", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "a", "a", "a", "a", "ae", "a", "ae", "c", "e", "e", "e", "e", "i", "i", "i", "i", "d", "n", "o", "o", "o", "o", "oe", "x", "o", "u", "u", "u", "ue", "y", "b", "ss", "a", "a", "a", "a", "ae", "a", "ae", "c", "e", "e", "e", "e", "i", "i", "i", "i", "o", "n", "o", "o", "o", "o", "oe", "_", "o", "u", "u", "u", "ue", "y", "b", "y"];

const yargs = require('yargs')
        .usage('Convert an AEM i18n dictionary to sling:MessageEntries.\nUsage: $0')
        .alias('H', 'help')
        .describe('help', 'Print usage and quit.')
        .alias('i', 'input')
        .require('input')
        .describe('input', 'i18n json format file'),
    argv = yargs.argv;

if (argv.H) {
    yargs.showHelp();
    process.exit(0);
}

function sortKey(a,b) {
    if (a.key < b.key)
        return -1;
    if (a.key > b.key)
        return 1;
    return 0;
}

/**
 * Direct from JcrUtil.createValidName
 *
 * https://helpx.adobe.com/experience-manager/6-3/sites/developing/using/reference-materials/javadoc/com/day/cq/commons/jcr/JcrUtil.html#createValidName(java.lang.String)
 *
 * @param title
 * @returns {string}
 */
function createValidName(title) {
    var labelCharMapping = STANDARD_LABEL_CHAR_MAPPING;
    var defaultReplacementCharacter = "_";

    var name = "";
    var prevEscaped = false;

    for(var idx = 0; idx < title.length && name.length < 64; ++idx) {
        var c = title.charCodeAt(idx);
        var repl = defaultReplacementCharacter;

        if (c >= 0 && c < labelCharMapping.length) {
            repl = labelCharMapping[c];
        }

        if (repl === defaultReplacementCharacter) {
            if (!prevEscaped && name.length < 16) {
                name += defaultReplacementCharacter;
            }

            prevEscaped = true;
        } else {
            name += repl;
            prevEscaped = false;
        }
    }

    return name;
}

var currentFolder = path.dirname(__filename);

var messagesTemplate = fs.readFileSync(currentFolder + "/messages.mustache", "utf8");
var messageTemplate = fs.readFileSync(currentFolder + "/message.mustache", "utf8");

var i18n = Object.entries(require(argv.input)).map(([key, value]) => ({key,value})).sort(sortKey);

/**
 * Convert existing keys into
 */
for (let i = 0; i < i18n.length; i++) {
    const message = i18n[i];

    message.name = createValidName(message.key);

    i18n[i] = message;
}

var data = {
    lang: path.basename(argv.input).split(".")[0],
    messages: i18n
};

console.log(Mustache.to_html(messagesTemplate, data, { message: messageTemplate }));