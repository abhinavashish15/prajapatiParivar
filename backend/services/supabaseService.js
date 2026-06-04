const { supabaseAdmin } = require('../config/supabase');

/**
 * Service to interact with Supabase database tables using the service-role client.
 * Bypasses Row Level Security (RLS) for server-side management/admin tasks.
 */
class SupabaseService {
  /**
   * Fetch all records from a table with filters, sorting, and pagination
   */
  static async findAll(table, { filters = {}, select = '*', order = null, limit = null, offset = null } = {}) {
    try {
      let query = supabaseAdmin.from(table).select(select);

      // Apply equality filters
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object') {
            // Support operators like gte, lte, ilike if structured as an object
            for (const [op, opVal] of Object.entries(value)) {
              if (opVal !== undefined && opVal !== null) {
                switch (op) {
                  case 'eq': query = query.eq(key, opVal); break;
                  case 'neq': query = query.neq(key, opVal); break;
                  case 'gt': query = query.gt(key, opVal); break;
                  case 'gte': query = query.gte(key, opVal); break;
                  case 'lt': query = query.lt(key, opVal); break;
                  case 'lte': query = query.lte(key, opVal); break;
                  case 'like': query = query.like(key, opVal); break;
                  case 'ilike': query = query.ilike(key, `%${opVal}%`); break;
                  default: query = query.eq(key, opVal);
                }
              }
            }
          } else {
            query = query.eq(key, value);
          }
        }
      }

      // Apply ordering
      if (order) {
        const { column, ascending = true } = order;
        query = query.order(column, { ascending });
      } else {
        // Default ordering if it exists
        query = query.order('created_at', { ascending: false, nullsFirst: false });
      }

      // Apply pagination limit/offset
      if (limit !== null) {
        const from = offset || 0;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count };
    } catch (err) {
      console.error(`SupabaseService.findAll Error on table [${table}]:`, err.message || err);
      // Fallback: return empty array
      return { data: [], count: 0, error: err };
    }
  }

  /**
   * Fetch a single record by field (default: id)
   */
  static async findOne(table, value, field = 'id') {
    try {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .eq(field, value)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`SupabaseService.findOne Error on table [${table}] (${field}=${value}):`, err.message || err);
      return null;
    }
  }

  /**
   * Create a new record in a table
   */
  static async create(table, payload) {
    try {
      const { data, error } = await supabaseAdmin
        .from(table)
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`SupabaseService.create Error on table [${table}]:`, err.message || err);
      throw err;
    }
  }

  /**
   * Update records matching filters
   */
  static async update(table, filters, payload) {
    try {
      let query = supabaseAdmin.from(table).update(payload);

      // Require filters to prevent accidental global updates
      if (Object.keys(filters).length === 0) {
        throw new Error('Update requires at least one filter');
      }

      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }

      const { data, error } = await query.select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`SupabaseService.update Error on table [${table}]:`, err.message || err);
      throw err;
    }
  }

  /**
   * Delete records matching filters
   */
  static async delete(table, filters) {
    try {
      let query = supabaseAdmin.from(table).delete();

      // Require filters to prevent accidental global deletions
      if (Object.keys(filters).length === 0) {
        throw new Error('Delete requires at least one filter');
      }

      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }

      const { data, error } = await query.select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`SupabaseService.delete Error on table [${table}]:`, err.message || err);
      throw err;
    }
  }

  /**
   * Delete a user from auth.users (cascades to other tables)
   */
  static async deleteAuthUser(userId) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`SupabaseService.deleteAuthUser Error:`, err.message || err);
      throw err;
    }
  }
}

module.exports = SupabaseService;
