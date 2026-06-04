const Event = require('../models/Event');
const { success, error } = require('../utils/response');

/**
 * Controller for Event management and registration operations
 */
class EventController {
  /**
   * Get events list
   */
  static async getAll(req, res) {
    try {
      const { status, location, search, page = 1, limit = 10 } = req.query;

      const parsedLimit = parseInt(limit, 10);
      const offset = (parseInt(page, 10) - 1) * parsedLimit;

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      
      // Non-admins can only see published events
      let queryStatus = 'published';
      if (isAdmin && status) {
        queryStatus = status;
      }

      const filters = {
        location,
        search
      };
      
      if (!isAdmin || status) {
        filters.status = queryStatus;
      }

      const { data, count, error: dbError } = await Event.findAll(filters, {
        limit: parsedLimit,
        offset
      });

      if (dbError) throw dbError;

      return success(res, 'Events fetched successfully', {
        events: data,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      });
    } catch (err) {
      console.error('EventController.getAll error:', err);
      return error(res, 'Failed to fetch events list.', 500);
    }
  }

  /**
   * Get single event by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);

      if (!event) {
        return error(res, 'Event not found.', 404);
      }

      const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
      if (event.status !== 'published' && !isAdmin) {
        return error(res, 'Access denied. Event is not public.', 403);
      }

      return success(res, 'Event fetched successfully', event);
    } catch (err) {
      console.error('EventController.getById error:', err);
      return error(res, 'Failed to fetch event details.', 500);
    }
  }

  /**
   * Admin: Create an event
   */
  static async create(req, res) {
    try {
      const payload = req.body;
      payload.created_by = req.user.id;

      const newEvent = await Event.create(payload);
      return success(res, 'Event created successfully', newEvent, 201);
    } catch (err) {
      console.error('EventController.create error:', err);
      return error(res, 'Failed to create event.', 500);
    }
  }

  /**
   * Admin: Update an event
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updated = await Event.update(id, payload);
      return success(res, 'Event updated successfully', updated);
    } catch (err) {
      console.error('EventController.update error:', err);
      return error(res, 'Failed to update event.', 500);
    }
  }

  /**
   * Admin: Delete an event
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Event.delete(id);
      return success(res, 'Event deleted successfully');
    } catch (err) {
      console.error('EventController.delete error:', err);
      return error(res, 'Failed to delete event.', 500);
    }
  }

  /**
   * Register authenticated user for an event
   */
  static async register(req, res) {
    try {
      const event_id = req.params.id;
      const user_id = req.user.id;
      const { ticket_count, details } = req.body;

      const registration = await Event.register(event_id, user_id, {
        ticket_count: ticket_count ? parseInt(ticket_count, 10) : 1,
        details
      });

      return success(res, 'Event registration successful', registration, 201);
    } catch (err) {
      console.error('EventController.register error:', err);
      return error(res, err.message || 'Failed to register for event.', 400);
    }
  }

  /**
   * Admin: Get all registrants for a specific event
   */
  static async getRegistrations(req, res) {
    try {
      const event_id = req.params.id;
      const { data } = await Event.getRegistrations(event_id);
      return success(res, 'Event registrations fetched successfully', data);
    } catch (err) {
      console.error('EventController.getRegistrations error:', err);
      return error(res, 'Failed to fetch event registrations.', 500);
    }
  }

  /**
   * Get logged-in user's event registrations
   */
  static async getMyRegistrations(req, res) {
    try {
      const user_id = req.user.id;
      const { data } = await Event.getUserRegistrations(user_id);
      return success(res, 'Your event registrations fetched successfully', data);
    } catch (err) {
      console.error('EventController.getMyRegistrations error:', err);
      return error(res, 'Failed to fetch your registrations.', 500);
    }
  }
}

module.exports = EventController;
