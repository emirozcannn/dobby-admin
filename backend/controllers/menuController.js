const { pool } = require('../config/database');

const getMenuItems = async (req, res) => {
  try {
    const { branch_id } = req.query;
    const userCompanyId = req.user.company_id;

    let query;
    let params;

    if (branch_id) {
      // Get branch-specific menu with customizations
      query = `
        SELECT 
          bp.id as branch_product_id,
          mp.id as master_product_id,
          COALESCE(bp.custom_name, mp.name) as name,
          bp.price,
          mp.base_price,
          mp.cost_price,
          mp.description,
          mp.image_url,
          c.name as category,
          c.id as category_id,
          bp.is_available,
          bp.sort_order
        FROM master_products mp
        JOIN categories c ON mp.category_id = c.id
        LEFT JOIN branch_products bp ON mp.id = bp.master_product_id AND bp.branch_id = $1
        WHERE mp.company_id = $2 AND mp.is_active = true AND c.is_active = true
        ORDER BY c.sort_order, bp.sort_order, mp.name
      `;
      params = [branch_id, userCompanyId];
    } else {
      // Get master menu (company level)
      query = `
        SELECT 
          mp.id,
          mp.name,
          mp.base_price as price,
          mp.cost_price,
          mp.description,
          mp.image_url,
          c.name as category,
          c.id as category_id,
          mp.is_active
        FROM master_products mp
        JOIN categories c ON mp.category_id = c.id
        WHERE mp.company_id = $1 AND mp.is_active = true AND c.is_active = true
        ORDER BY c.sort_order, mp.name
      `;
      params = [userCompanyId];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const userCompanyId = req.user.company_id;

    const result = await pool.query(
      `SELECT * FROM categories WHERE company_id = $1 
       AND is_active = true ORDER BY sort_order, name`,
      [userCompanyId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getMenuItems,
  getCategories
};
