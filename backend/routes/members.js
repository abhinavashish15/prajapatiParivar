const express = require('express');
const router = express.Router();
const MemberController = require('../controller/memberController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/authMiddleware');

// Get all member profiles (with optional auth, showing approved items to guests, and all items to admin)
router.get('/', optionalAuth, MemberController.getAll);

// Profile management routes for logged in user
router.get('/profile/me', requireAuth, MemberController.getMyProfile);
router.put('/profile/me', requireAuth, MemberController.updateMyProfile);
router.delete('/profile/me', requireAuth, MemberController.deleteMyProfile);

// Get single member profile
router.get('/:id', optionalAuth, MemberController.getById);

// Admin approval operations
router.put('/:id/approve', requireAuth, requireRole(['admin', 'super_admin']), MemberController.approve);
router.put('/:id/reject', requireAuth, requireRole(['admin', 'super_admin']), MemberController.reject);

// Role assignment route (super_admin or admin)
router.put('/:id/role', requireAuth, requireRole(['admin', 'super_admin']), MemberController.changeRole);

module.exports = router;
