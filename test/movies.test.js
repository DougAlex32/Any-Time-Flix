const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');

// /movies/test GET route
describe('GET movies/test', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/test')
      .expect(200, done);
    });
  });

// /movies/search/:query/:page GET route
describe('GET movies/search/:query', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/search/Hackers/1')
      .expect(200, done);
    });
  });

// /movies/movie/:id GET route
describe('GET movies/movie/:id', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/movie/11')
      .expect(200, done);
    });
  });

// /movies/movie:id/recommendations/:page GET route
describe('GET movies/movie/:id/recommendations/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/movie/11/recommendations/1')
      .expect(200, done);
    });
  });

// /movies/popular/:page GET route
describe('GET movies/popular/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/popular/1')
      .expect(200, done);
    });
  });

// /movies/now-playing/:page GET route
describe('GET movies/now-playing/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/now-playing/1')
      .expect(200, done);
    });
  });

// /movies/upcoming/:page GET route
describe('GET movies/upcoming/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/upcoming/1')
      .expect(200, done);
    });
  });

// /movies/top-rated/:page GET route
describe('GET movies/top-rated/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/top-rated/1')
      .expect(200, done);
    });
  });

// /movies/genre/movie/list GET route
describe('GET movies/genre/movie/list', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/genre/movie/list')
      .expect(200, done);
    });
  });

// /discover/year/:year/:page GET route
describe('GET discover/year/:year/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/discover/year/2020/1')
      .expect(200, done);
    });
  });

// /discover/genre/:genre/:page GET route
describe('GET discover/genre/:genre/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/discover/genre/28/1')
      .expect(200, done);
    });
  });

// /discover/rating/:rating/:page GET route
describe('GET discover/rating/:rating/:page', () => {
    it('should return status code 200 on successful GET request', (done) => {
      request(app).get('/movies/discover/rating/8/1')
      .expect(200, done);
    });
  });