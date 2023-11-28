#!/usr/bin/env node

'use strict';

const run = require('../lib/index');

async function main() {
  try {
    await run();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
