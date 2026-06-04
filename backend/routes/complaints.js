const express = require('express');
const router = express.Router();
const ComplaintController = require('../controller/complaintController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/authMiddleware');

// Get all complaints and specific complaint
router.get('/', optionalAuth, ComplaintController.getAll);
router.get('/:id', optionalAuth, ComplaintController.getById);

// Submit a new complaint/need
router.post('/', requireAuth, ComplaintController.create);

// Edit, resolve or delete a complaint
router.put('/:id', requireAuth, ComplaintController.update);
router.patch('/:id/resolve', requireAuth, ComplaintController.resolve);
router.delete('/:id', requireAuth, ComplaintController.delete);

// Admin-only verification routes
router.patch('/:id/verify', requireAuth, requireRole(['admin', 'super_admin']), ComplaintController.verify);

module.exports = router;
