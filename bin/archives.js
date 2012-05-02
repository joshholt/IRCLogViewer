#!/usr/local/bin/node
/**
 * The Cron Job to for archive building
 * 59 23 * * * /home/jholt/irc-logger/IRCLogViewer/bin/archives
 */
var builder = require('../scripts/build_archive');
builder.buildArchives();