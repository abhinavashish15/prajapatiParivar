const express = require('express');
const router = express.Router();
const EventController = require('../controller/eventController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/authMiddleware');

// Get all events and specific event
router.get('/', optionalAuth, EventController.getAll);
router.get('/registrations/me', requireAuth, EventController.getMyRegistrations);
router.get('/:id', optionalAuth, EventController.getById);

// Register for an event
router.post('/:id/register', requireAuth, EventController.register);

// Admin routes
router.post('/', requireAuth, requireRole(['admin', 'super_admin']), EventController.create);
router.put('/:id', requireAuth, requireRole(['admin', 'super_admin']), EventController.update);
router.delete('/:id', requireAuth, requireRole(['admin', 'super_admin']), EventController.delete);
router.get('/:id/registrations', requireAuth, requireRole(['admin', 'super_admin']), EventController.getRegistrations);

module.exports = router;
