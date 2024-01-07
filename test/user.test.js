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
    password: "Metamark1",
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

// create new user with users/signup POST route
describe('POST /users/signup', () => {
  it('should create a signup user with valid email', (done) => {
    const email = "markzuckerberg@email.com" 
    request(app).post('/users/signup/').type('form').send({
      firstName: "Mark",
      lastName: "Zuckerberg",
      userName: "metaFounder",
      city: "Palo Alto",
      state: "California",
      country: "USA",
      email: email,
      password: "Metamark1",
      bio: "CEO of Meta",
      profilePicture: "picture.jpeg",
  })
    .then(response => {
      console.log('new user created: ', response._body);
      expect(response._body.user.email).to.be.equal(email);
      done();
    })
    .catch(error => {
      console.log("Error in creating new user: ", error);
      throw error;
    })
  })
  it('should return a 200 response', (done) => {
    const email = "markzuckerberg@facebook.com";
    request(app).post('/users/signup/')
    .type('form')
    .send({
      firstName: "Mark",
      lastName: "Zuckerberg",
      userName: "metaFounder",
      city: "Palo Alto",
      state: "California",
      country: "USA",
      email: email,
      password: "Metamark1",
      bio: "CEO of Meta",
      profilePicture: "picture.jpeg",
  })
  .expect(200, done);
  })
});

// update user info with PUT route
describe('PUT /users/:id', () => {
  it('should update an existing user information', (done) => {
    // create a new user
    let new = newUser;
    new = { ...new, ...new.bio }
    delete new.bio;
    request(app).post('/users/signup/')
    .type('form')
    .send(newUser)
    .then(response => {
      console.log('new user created', response._body);
      // get the id from the newly created user and add to the update object
      const newBio = response._body.user.bio;
      console.log(userId);
      request(app).put(`/users/${userId}`)
      .type('form')
      .send({
        bio: newBio})
      })
      .then(updatedResponse => {
        expect(updatedResponse._body.user.address).to.be.equal(newBio);
        done();
      })
  })
})