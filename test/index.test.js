
const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');


describe('App', function() {
  it('should return a 200 response', function(done) {
    request(app).get('/').expect(200, done);
  });
});