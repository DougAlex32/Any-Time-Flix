const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');

describe('GET /', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/')
      .expect(200, done);
    });
  });

  