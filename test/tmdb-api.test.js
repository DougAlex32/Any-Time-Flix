const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming Express app is defined in 'app.js'

chai.use(chaiHttp);
const expect = chai.expect;
const request = require('supertest');
// const { TMDB_API } = require('../models');

describe('TMDb API Routes', () => {
    it('should search for movies', (done) => {
        chai
            .request(app)
            .get('/api/search/Star Wars')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                // Add more assertions for the response body as needed
                done();
            });
    });

//     it('should get movie details by ID', (done) => {
//         chai
//             .request(app)
//             .get('/api/movie/11')
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 // Add more assertions for the response body as needed
//                 done();
//             });
//     });

//     it('should get movie credits by ID', (done) => {
//         chai
//             .request(app)
//             .get('/api/movie/11/credits')
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 // Add more assertions for the response body as needed
//                 done();
//             });
//     });

//     it('should discover movies by genre', (done) => {
//         chai
//             .request(app)
//             .get('/api/discover/878')
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 // Add more assertions for the response body as needed
//                 done();
//             });
//     });

//     it('should get movie recommendations by ID', (done) => {
//         chai
//             .request(app)
//             .get('/api/movie/11/recommendations')
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 // Add more assertions for the response body as needed
//                 done();
//             });
//     });

//     it('should get popular movies', (done) => {
//         chai
//             .request(app)
//             .get('/api/popular')
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 // Add more assertions for the response body as needed
//                 done();
//             });
//     });

//     it('should get now playing movies', (done) => {
//         chai
//             .request(app)
//             .get('/api/now-playing')
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.be.an('object');
//                 // Add more assertions for the response body as needed
//                 done();
//             });
//     });
});
