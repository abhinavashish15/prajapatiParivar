const { supabaseAdmin } = require('../config/supabase');
const { error } = require('../utils/response');
const Member = require('../models/Member');

/**
 * Middleware to authenticate requests using Supabase JWT
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authentication required. Bearer token missing.', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Call Supabase Auth to get user details using the JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return error(res, 'Invalid or expired authentication token.', 401);
    }

    // Attach user information to request
    req.user = user;

    // Get user's database role
    const roleRecord = await Member.getRole(user.id);
    req.user.role = roleRecord ? roleRecord.role : 'guest';

    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return error(res, 'Internal authentication error.', 500);
  }
};

/**
 * Middleware to optionally authenticate requests using Supabase JWT
 * If token is invalid or missing, it continues without setting req.user
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    // Call Supabase Auth to get user details using the JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (!authError && user) {
      // Attach user information to request
      req.user = user;

      // Get user's database role
      const roleRecord = await Member.getRole(user.id);
      req.user.role = roleRecord ? roleRecord.role : 'guest';
    }

    next();
  } catch (err) {
    console.error('optionalAuth error:', err);
    next();
  }
};

/**
 * Middleware to restrict route access to specific roles
 * @param {Array<string>} roles - List of allowed roles
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Forbidden. Access restricted to authorized roles only.', 403);
    }

    next();
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole
};
