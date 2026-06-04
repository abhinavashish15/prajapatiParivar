/**
 * Standard API response helper functions
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response payload data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Detailed errors/validation failure objects
 */
const error = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  success,
  error
};
