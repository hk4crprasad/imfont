const { expect } = require('chai');
const { run } = require('../lib/index');

describe('Imfont Tests', () => {
  it('should run without errors', async () => {
    try {
      await run();
    } catch (err) {
      // If the run function throws an error, fail the test
      throw err;
    }
  });

  // Add more tests based on your specific functionality
});
