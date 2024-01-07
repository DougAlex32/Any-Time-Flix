const app = require('../app');
const request = require('supertest');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const newUser = {
    firstName: "Mark",
    lastName: "Zuckerberg",
    userName: "metaFounder",
    city: "Palo Alto",
    state: "California",
    country: "USA",
    email: "markzuckerberg@facebook.com",
    password: "Metamark",
    bio: "CEO of Meta",
    profilePicture: "picture.jpeg",
}

// test home route
describe('GET /', () => {
  it('should return status code 200 on successful GET request', (done) => {
    request(app).get('/')
    .expect(200, done);
  });
});

// test users
describe('GET /users', () => {
  it('should return status code 200 on successful GET request', (done) => {
    request(app).get('/users/test')
    .expect(200, done);
  });
});