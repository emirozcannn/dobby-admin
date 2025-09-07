const { pool } = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('📦 Creating database tables...');

    // Companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Branches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        manager_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('company_admin', 'branch_manager', 'cashier')),
        full_name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Master products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS master_products (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        cost_price DECIMAL(10,2),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Branch products (customization) table
    await client.query(`
      CREATE TABLE IF NOT EXISTS branch_products (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
        master_product_id INTEGER REFERENCES master_products(id) ON DELETE CASCADE,
        custom_name VARCHAR(255),
        price DECIMAL(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(branch_id, master_product_id)
      );
    `);

    // Add foreign key constraint for manager_id after users table is created
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'branches_manager_id_fkey'
        ) THEN
          ALTER TABLE branches 
          ADD CONSTRAINT branches_manager_id_fkey 
          FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const insertSampleData = async () => {
  const client = await pool.connect();
  
  try {
    console.log('📝 Inserting sample data...');

    // Insert sample company
    const companyResult = await client.query(`
      INSERT INTO companies (name, email, phone, address) 
      VALUES ('Dobby Cafe', 'admin@dobby.com', '+90 555 123 4567', 'İstanbul, Türkiye')
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `);

    let companyId;
    if (companyResult.rows.length > 0) {
      companyId = companyResult.rows[0].id;
    } else {
      const existingCompany = await client.query('SELECT id FROM companies WHERE email = $1', ['admin@dobby.com']);
      companyId = existingCompany.rows[0].id;
    }

    // Insert sample branches
    const branchResult = await client.query(`
      INSERT INTO branches (company_id, name, address, phone) 
      VALUES 
        ($1, 'Dobby Cafe Kadıköy', 'Kadıköy, İstanbul', '+90 555 111 2233'),
        ($1, 'Dobby Cafe Beşiktaş', 'Beşiktaş, İstanbul', '+90 555 111 2244')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `, [companyId]);

    // Insert admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', parseInt(process.env.BCRYPT_ROUNDS));

    await client.query(`
      INSERT INTO users (company_id, username, email, password_hash, role, full_name)
      VALUES ($1, 'admin', 'admin@dobby.com', $2, 'company_admin', 'Admin User')
      ON CONFLICT (email) DO NOTHING;
    `, [companyId, hashedPassword]);

    // Insert sample categories
    await client.query(`
      INSERT INTO categories (company_id, name, sort_order)
      VALUES 
        ($1, 'Kahve', 1),
        ($1, 'Çay', 2),
        ($1, 'İçecek', 3),
        ($1, 'Tatlı', 4)
      ON CONFLICT DO NOTHING;
    `, [companyId]);

    console.log('✅ Sample data inserted successfully!');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  } finally {
    client.release();
  }
};

const runMigration = async () => {
  try {
    await createTables();
    await insertSampleData();
    console.log('🎉 Database migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

module.exports = {
  createTables,
  insertSampleData
};
