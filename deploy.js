#!/usr/bin/env node
var exec = require('child_process').exec;

exec("scp -p -r ./ root@60.205.228.69:/data/www/nodejs/quguangjie", function (err, rs) {
  if (!err) {
    console.info('deploy success.')
  } else {
    console.error(err)
  }
})