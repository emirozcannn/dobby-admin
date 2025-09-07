const { generateToken, verifyToken } = require('../utils/jwt');

describe('JWT Utilities Tests', () => {
  const testUser = {
    id: 1,
    email: 'test@dobby.com',
    role: 'admin',
    company_id: 1,
    branch_id: 1
  };

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const token = generateToken(testUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUser.id);
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.role).toBe(testUser.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow('Invalid token');
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow('Invalid token');
    });
  });
});
