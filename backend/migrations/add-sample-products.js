const { pool } = require('../config/database');

const addSampleProducts = async () => {
  const client = await pool.connect();

  try {
    console.log('📝 Adding sample products...');

    // Get company and category IDs
    const companyResult = await client.query('SELECT id FROM companies WHERE email = $1', [
      'admin@dobby.com'
    ]);
    const companyId = companyResult.rows[0].id;

    const categoriesResult = await client.query(
      'SELECT id, name FROM categories WHERE company_id = $1',
      [companyId]
    );
    const categories = {};
    categoriesResult.rows.forEach(cat => {
      categories[cat.name] = cat.id;
    });

    // Insert sample products
    const products = [
      {
        name: 'Türk Kahvesi',
        price: 25,
        cost: 8,
        category: 'Kahve',
        description: 'Geleneksel Türk kahvesi'
      },
      {
        name: 'Cappuccino',
        price: 35,
        cost: 12,
        category: 'Kahve',
        description: 'İtalyan cappuccino'
      },
      { name: 'Latte', price: 40, cost: 15, category: 'Kahve', description: 'Sütlü kahve' },
      { name: 'Espresso', price: 20, cost: 7, category: 'Kahve', description: 'Yoğun kahve' },

      { name: 'Çay', price: 15, cost: 3, category: 'Çay', description: 'Bergamot çayı' },
      { name: 'Yeşil Çay', price: 18, cost: 4, category: 'Çay', description: 'Antioxidan çay' },
      {
        name: 'Bitki Çayı',
        price: 20,
        cost: 5,
        category: 'Çay',
        description: 'Karışık bitki çayı'
      },

      { name: 'Su', price: 5, cost: 1, category: 'İçecek', description: '500ml su' },
      { name: 'Ayran', price: 12, cost: 4, category: 'İçecek', description: 'Taze ayran' },
      { name: 'Kola', price: 15, cost: 6, category: 'İçecek', description: 'Soğuk kola' },
      {
        name: 'Portakal Suyu',
        price: 18,
        cost: 7,
        category: 'İçecek',
        description: 'Taze sıkılmış'
      },

      {
        name: 'Cheesecake',
        price: 45,
        cost: 20,
        category: 'Tatlı',
        description: 'New York cheesecake'
      },
      { name: 'Tiramisu', price: 50, cost: 25, category: 'Tatlı', description: 'İtalyan tiramisu' },
      { name: 'Brownie', price: 35, cost: 15, category: 'Tatlı', description: 'Çikolatalı brownie' }
    ];

    for (const product of products) {
      const categoryId = categories[product.category];
      if (categoryId) {
        await client.query(
          `
          INSERT INTO master_products 
          (company_id, category_id, name, description, base_price, cost_price)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `,
          [companyId, categoryId, product.name, product.description, product.price, product.cost]
        );
      }
    }

    console.log('✅ Sample products added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  addSampleProducts()
    .then(() => {
      console.log('🎉 Sample products migration completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  addSampleProducts
};
