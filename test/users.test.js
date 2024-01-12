const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
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

let testUser;
let testHeaders
let testToken;

// /users/test GET route
describe("GET '/test' route in /controllers/users.js", function() {
  it('should return a 200 response', function(done) {
    request(app).get('/users/test').expect(200, done);
  });
});

// /users/signup POST route
describe("POST 'users/signup' route in /controllers/users.js", function() {
    it('should create a new user using the signup route', async function() {
        const res = await request(app)
        .post('/users/signup')
        .send(newUser);
        testUser = res.body.userData;
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('userData');
        expect(res.body.userData).to.have.property('firstName');
        expect(res.body.userData.firstName).to.equal(newUser.firstName);
        expect(res.body.userData).to.have.property('lastName');
        expect(res.body.userData.lastName).to.equal(newUser.lastName);
    });
});

// /users/login POST route
describe("POST '/users/login' route", function () {
  it('should authenticate user, check password, and return JWT token', async function () {
    const testUser = {
      email: "markzuckerberg@facebook.com",
      password: "Metamark1"
    };
    const res = await request(app)
      .post('/users/login')
      .send(testUser);
      testToken = res.body.token;
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('success').to.equal(true);
    expect(res.body).to.have.property('token').to.be.a('string');
    expect(res.body).to.have.property('userData').to.be.an('object');
    expect(res.body.userData).to.have.property('firstName');
    expect(res.body.userData).to.have.property('email').to.equal(testUser.email);
  });
});

// /users/ PUT route
describe("PUT '/users/' route", function () {
  it('should update user info based on request body', async function () {
    const token = testToken;
    const updatedUserData = {
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
    };
    const res = await request(app)
      .put(`/users/`)
      .set('Authorization', `${token}`)
      .send(updatedUserData);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('userData');
    expect(res.body).to.have.property('message').to.equal('User updated');
    expect(res.body.userData).to.have.property('firstName').to.equal(updatedUserData.firstName);
    expect(res.body.userData).to.have.property('lastName').to.equal(updatedUserData.lastName);
  });
});

// /users/addToList/:listName/ PUT route
describe("PUT '/users/addToList/:listName/' route", function () {
  it('should add movie to list', async function () {
    const token = testToken;
    const res = await request(app)
      .put(`/users/addToList/watchList/`, {movie: 11})
      .set('Authorization', `${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('Movie added to watchList');
  });
});

// /users/removeFromList/:listName/ PUT route
describe("PUT '/users/removeFromList/:listName/' route", function () {
  it('should remove movie from list', async function () {
    const token = testToken;
    const res = await request(app)
      .put(`/users/removeFromList/watchList/`)
      .set('Authorization', `${token}`)
      .send({movie: {id: 11}});

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('Movie removed from watchList');
  });
});

// /users/refreshData/ GET route
describe("GET '/users/refreshData/' route", function () {
  it('should refresh user data', async function () {
    const token = testToken;
    const res = await request(app)
      .get(`/users/refreshData/`)
      .set('Authorization', `${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('User data refreshed');
  });
});

// /users/updateTokenExpiration GET route
describe("GET '/users/updateTokenExpiration' route", function () {
  it('should update token expiration', async function () {
    const token = testToken;
    const res = await request(app)
      .get(`/users/updateTokenExpiration`)
      .set('Authorization', `${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('Token expiration updated');
  });
});

// /users/ DELETE route
describe("DELETE '/users/' route", function () {
  it('should delete user', async function () {
    const token = testToken;
    const res = await request(app)
      .delete(`/users/`)
      .set('Authorization', `${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').to.equal('You have successfully deleted your account');
  });
});


// Clean up: Delete the user created for testing after all tests have run
after(async function() {
  await User.findByIdAndDelete(testUser._id);
});
