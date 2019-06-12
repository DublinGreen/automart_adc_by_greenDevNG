# index.spec.js

const expect = require('chai').expect
const server = require('../index');

describe('test', () => {
  it('should return a string', () => {
    expect('Welcome to My API for Andela Bootcamp Cycle 45.').to.equal('Welcome to My API for Andela Bootcamp Cycle 45.');
  });
});
