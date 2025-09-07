const request = require('supertest');
const app = require('../server');

describe('Server Health Tests', () => {
  describe('GET /', () => {
    it('should return server status', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/health', () => {
    it('should return health check', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
});
