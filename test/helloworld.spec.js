const assert = require('assert');
describe('Test Mocha framework', function() {
    it.skip('should pas the test', function () {
        assert.strictEqual(2, 3, 'value are not equal');
    });
});