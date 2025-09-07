const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    // Get user from database
    const userQuery = `
      SELECT u.*, c.name as company_name, b.name as branch_name
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      LEFT JOIN branches b ON u.branch_id = b.id
      WHERE u.email = $1 AND u.is_active = true
    `;

    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        company_id: user.company_id,
        company_name: user.company_name,
        branch_id: user.branch_id,
        branch_name: user.branch_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userQuery = `
      SELECT u.id, u.username, u.email, u.full_name, u.role, 
             u.company_id, c.name as company_name,
             u.branch_id, b.name as branch_name,
             u.last_login, u.created_at
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      LEFT JOIN branches b ON u.branch_id = b.id
      WHERE u.id = $1 AND u.is_active = true
    `;

    const result = await pool.query(userQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const logout = async (req, res) => {
  // In a real app, you might want to blacklist the token
  // For now, we'll just return success (client should remove token)
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  login,
  getProfile,
  logout
};
