const SupabaseService = require('../services/supabaseService');

class Complaint {
  static TABLE = 'complaints';

  /**
   * Find complaints with filters and pagination
   */
  static async findAll(filters = {}, { limit, offset, order } = {}) {
    const queryFilters = {};

    if (filters.status) {
      queryFilters.status = filters.status;
    }
    if (filters.type) {
      queryFilters.type = filters.type;
    }
    if (filters.user_id) {
      queryFilters.user_id = filters.user_id;
    }
    if (filters.search) {
      queryFilters.title = { ilike: filters.search };
    }

    return await SupabaseService.findAll(this.TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order: order || { column: 'created_at', ascending: false }
    });
  }

  /**
   * Find a specific complaint by ID
   */
  static async findById(id) {
    return await SupabaseService.findOne(this.TABLE, id);
  }

  /**
   * Create a new complaint
   */
  static async create(payload) {
    const data = {
      ...payload,
      status: payload.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return await SupabaseService.create(this.TABLE, data);
  }

  /**
   * Update an existing complaint
   */
  static async update(id, payload) {
    const data = {
      ...payload,
      updated_at: new Date().toISOString()
    };
    return await SupabaseService.update(this.TABLE, { id }, data);
  }

  /**
   * Delete a complaint
   */
  static async delete(id) {
    return await SupabaseService.delete(this.TABLE, { id });
  }
}

module.exports = Complaint;
