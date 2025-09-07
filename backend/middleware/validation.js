const Joi = require('joi');

// Validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Geçerli bir email adresi giriniz',
      'any.required': 'Email zorunludur'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre zorunludur'
    })
  }),

  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('company_admin', 'branch_manager', 'cashier').required(),
    company_id: Joi.number().integer().positive().required(),
    branch_id: Joi.number().integer().positive().allow(null)
  }),

  branch: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    address: Joi.string().max(500).allow(''),
    phone: Joi.string().max(50).allow(''),
    manager_id: Joi.number().integer().positive().allow(null)
  }),

  category: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    sort_order: Joi.number().integer().min(0).default(0)
  }),

  product: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(1000).allow(''),
    base_price: Joi.number().positive().precision(2).required(),
    cost_price: Joi.number().positive().precision(2).allow(null),
    category_id: Joi.number().integer().positive().required()
  })
};

// Validation middleware generator
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Quick validation helpers
const validateLogin = validate(schemas.login);
const validateRegister = validate(schemas.register);
const validateBranch = validate(schemas.branch);
const validateCategory = validate(schemas.category);
const validateProduct = validate(schemas.product);

module.exports = {
  schemas,
  validate,
  validateLogin,
  validateRegister,
  validateBranch,
  validateCategory,
  validateProduct
};
