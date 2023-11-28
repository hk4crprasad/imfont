#!/usr/bin/env node
'use strict';

const { run } = require('../lib/index');

run().catch(err => {
  console.error(err);
  process.exit(1);
});
