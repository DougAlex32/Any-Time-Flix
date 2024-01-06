// const expect = require('chai').expect;
// const db = require('../models');

// before(function(done) {
//   db.sequelize.sync({ force: true }).then(function() {
//     done();
//   });
// });

// describe('Creating a User', function() {
//   it('should create successfully', function(done) {
//     db.user.create({
//       email: 'test@test.co',
//       name: 'Muttbuncher',
//       password: 'password'
//     }).then(function() {
//       done();
//     }).catch(function(error) {
//       done(error);
//     });
//   });

//   it('should throw an error on invalid email addresses', function(done) {
//     db.user.create({
//       email: 'test',
//       name: 'Brian',
//       password: 'password'
//     }).then(function(newUser) {
//       done(newUser);
//     }).catch(function(error) {
//       done();
//     });
//   });

//   it('should throw an error on invalid name', function(done) {
//     db.user.create({
//       email: 'test@test.co',
//       name: '',
//       password: 'password'
//     }).then(function(newUser) {
//       done(newUser);
//     }).catch(function(error) {
//       done();
//     });
//   });

//   it('should throw an error on invalid password', function(done) {
//     db.user.create({
//       email: 'test@test.co',
//       name: 'Brian',
//       password: 'short'
//     }).then(function(newUser) {
//       done(newUser);
//     }).catch(function(error) {
//       done();
//     });
//   });

//   it('should hash the password before save', function(done) {
//     db.user.create({
//       email: 'test@test.co',
//       name: 'Muttbuncher',
//       password: 'password'
//     }).then(function(newUser) {
//       if (newUser.password === 'password') {
//         done(newUser);
//       } else {
//         done();
//       }
//     }).catch(function(error) {
//       done(error);
//     });
//   });
// });

// describe('User instance methods', function() {
//   describe('validPassword', function() {
//     it('should validate a correct password', function(done) {
//       db.user.findOne().then(function(user) {
//         if (user.validPassword('123123123')) {
//           done();
//         } else {
//           done(user);
//         }
//       }).catch(function(error) {
//         done(error);
//       });
//     });

//     it('should invalidate an incorrect password', function(done) {
//       db.user.findOne().then(function(user) {
//         if (!user.validPassword('nope')) {
//           done();
//         } else {
//           done(user);
//         }
//       }).catch(function(error) {
//         done(error);
//       });
//     });
//   });

//   describe('toJSON', function() {
//     it('should return a user without a password field', function(done) {
//       db.user.findOne().then(function(user) {
//         if (user.toJSON().password === undefined) {
//           done();
//         } else {
//           done(user);
//         }
//       }).catch(function(error) {
//         done(error);
//       });
//     });
//   });
// });

// create test
// describe("User Model", () => {
//   const User = require("../models/").User;
//   let newUser = new User({ username: "testUser" });
//   beforeEach((done) => {
//     User.remove({}, (err) => {
//       done();
//     });
//   });
//   afterEach(() => {
//     User.remove({}, (err) => {
//       console.log("cleaned up");
//     });
//   });
//   describe("create", () => {
//     it("creates a new user and sets the username to 'testUser' ", () =>
//       expect(newUser.username).toBe("testUser"));
//     it("saves the created user in the database", (done) => {
//       newUser.save((err, savedUser) => {
//         console.log(savedUser);
//         expect(savedUser.username).toEqual(expect.anything());
//         done();
//       });
//     });
//   });
// });

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
    profilePicture: "pic.jpeg",
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

  it('returns a user with email', async () => {
    try {
      const response = await request(app).get('/users/test');
      console.log('response will return with an email', response.body);
      expect(response.body).to.have.property('email');
      } catch (err) {
        console.error('test error', err);
        throw err;
    }
  });
  it('should have more than 1 user', async () => {
    try{
      const response = await request(app).get('/users/test');
      console.log('response - should have more than 1 user', response.body.length);
      expect(response.body.length).to.be.above(1);
    } catch (err) {
      console.error('test error:', err);
      throw err;
    } 
  });
});