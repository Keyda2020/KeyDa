const request = require('supertest');
const app = require('../src/app');

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app).get('/reset').expect(404, done);
  });
});
