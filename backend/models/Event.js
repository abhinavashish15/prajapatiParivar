const SupabaseService = require('../services/supabaseService');

class Event {
  static TABLE = 'events';
  static REGISTRATIONS_TABLE = 'event_registrations';

  /**
   * Find events with filters and pagination
   */
  static async findAll(filters = {}, { limit, offset, order } = {}) {
    const queryFilters = {};

    if (filters.status) {
      queryFilters.status = filters.status;
    }
    if (filters.location) {
      queryFilters.location = { ilike: filters.location };
    }
    if (filters.search) {
      queryFilters.title = { ilike: filters.search };
    }

    return await SupabaseService.findAll(this.TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order: order || { column: 'date', ascending: true }
    });
  }

  /**
   * Find a specific event by ID
   */
  static async findById(id) {
    return await SupabaseService.findOne(this.TABLE, id);
  }

  /**
   * Create a new event
   */
  static async create(payload) {
    const data = {
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await SupabaseService.create(this.TABLE, data);
  }

  /**
   * Update an existing event
   */
  static async update(id, payload) {
    const data = {
      ...payload,
      updated_at: new Date().toISOString()
    };
    return await SupabaseService.update(this.TABLE, { id }, data);
  }

  /**
   * Delete an event
   */
  static async delete(id) {
    return await SupabaseService.delete(this.TABLE, { id });
  }

  /**
   * Register a user for an event
   */
  static async register(event_id, user_id, { ticket_count = 1, details = {} } = {}) {
    // Check if event exists and is active
    const event = await this.findById(event_id);
    if (!event) {
      throw new Error('Event not found.');
    }
    if (event.status !== 'published') {
      throw new Error('This event is not open for registration.');
    }

    // Check if already registered
    const { data: existingRegs } = await SupabaseService.findAll(this.REGISTRATIONS_TABLE, {
      filters: { event_id, user_id }
    });

    if (existingRegs && existingRegs.length > 0) {
      throw new Error('You are already registered for this event.');
    }

    // Capacity checks
    if (event.capacity) {
      const { count } = await SupabaseService.findAll(this.REGISTRATIONS_TABLE, {
        filters: { event_id }
      });
      // Sum existing tickets
      const { data: registrations } = await SupabaseService.findAll(this.REGISTRATIONS_TABLE, {
        filters: { event_id }
      });
      const totalTickets = registrations.reduce((sum, r) => sum + (r.ticket_count || 1), 0);
      
      if (totalTickets + ticket_count > event.capacity) {
        throw new Error('Event is at full capacity.');
      }
    }

    return await SupabaseService.create(this.REGISTRATIONS_TABLE, {
      event_id,
      user_id,
      ticket_count,
      details,
      attendance_status: 'registered',
      registration_date: new Date().toISOString()
    });
  }

  /**
   * Get registrations for a specific event
   */
  static async getRegistrations(event_id) {
    return await SupabaseService.findAll(this.REGISTRATIONS_TABLE, {
      filters: { event_id }
    });
  }

  /**
   * Get registrations for a specific user
   */
  static async getUserRegistrations(user_id) {
    return await SupabaseService.findAll(this.REGISTRATIONS_TABLE, {
      filters: { user_id }
    });
  }
}

module.exports = Event;
