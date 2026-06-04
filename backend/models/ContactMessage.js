const SupabaseService = require('../services/supabaseService');

class ContactMessage {
  static TABLE = 'contact_messages';

  /**
   * Find contact messages (for Admin panel viewing)
   */
  static async findAll(filters = {}, { limit, offset } = {}) {
    const queryFilters = {};
    if (filters.email) {
      queryFilters.email = { ilike: filters.email };
    }
    if (filters.search) {
      queryFilters.name = { ilike: filters.search };
    }

    return await SupabaseService.findAll(this.TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Create a new contact message
   */
  static async create(payload) {
    const data = {
      ...payload,
      created_at: new Date().toISOString()
    };
    return await SupabaseService.create(this.TABLE, data);
  }

  /**
   * Delete a contact message
   */
  static async delete(id) {
    return await SupabaseService.delete(this.TABLE, { id });
  }
}

module.exports = ContactMessage;
