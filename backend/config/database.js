const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'dobby_cafe',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL bağlantısı başarılı!');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL bağlantı hatası:', err.message);
    console.log('💡 PostgreSQL\'in çalıştığından emin olun:');
    console.log('   - PostgreSQL service running');
    console.log('   - Database: dobby_cafe created');
    console.log('   - User/password correct');
  }
};

module.exports = {
  pool,
  testConnection
};
