// Test setup file
require('dotenv').config({ path: '.env.test' });

// Suppress console output during tests for cleaner output
if (process.env.NODE_ENV === 'test') {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};

  // Only keep real errors
  const originalError = console.error;
  console.error = (...args) => {
    // Only show actual errors, not database connection warnings
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('Failed') || args[0].includes('Error'))
    ) {
      originalError(...args);
    }
  };
}
