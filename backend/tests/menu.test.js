const request = require('supertest');
const app = require('../server');

describe('Menu API Tests', () => {
  describe('GET /api/menu', () => {
    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/menu');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/menu')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/menu/categories', () => {
    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/menu/categories');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/menu/categories')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
