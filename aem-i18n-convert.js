#!/usr/bin/env node

var Mustache = require('mustache');
var fs = require('fs');
var path = require('path');

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

var messagesTemplate = fs.readFileSync("messages.mustache", "utf8");
var messageTemplate = fs.readFileSync("message.mustache", "utf8");

var i18n = require(argv.input);

var data = {
    lang: path.basename(argv.input).split(".")[0],
    messages: Object.entries(i18n).map(([key, value]) => ({key,value})).sort(sortKey)
};

console.log(Mustache.to_html(messagesTemplate, data, { message: messageTemplate }));