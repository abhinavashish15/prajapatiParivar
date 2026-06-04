const SupabaseService = require('../services/supabaseService');

class Member {
  static TABLE = 'member_profiles';
  static ROLES_TABLE = 'user_roles';

  /**
   * Find members with filters and pagination
   */
  static async findAll(filters = {}, { limit, offset, order } = {}) {
    const queryFilters = {};

    if (filters.status) {
      queryFilters.status = filters.status;
    }
    if (filters.gender) {
      queryFilters.gender = filters.gender;
    }
    if (filters.state) {
      queryFilters.state = { ilike: filters.state };
    }
    if (filters.city) {
      queryFilters.city = { ilike: filters.city };
    }
    if (filters.district) {
      queryFilters.district = { ilike: filters.district };
    }
    if (filters.profession) {
      queryFilters.profession = { ilike: filters.profession };
    }
    if (filters.search) {
      queryFilters.full_name = { ilike: filters.search };
    }
    if (filters.is_featured !== undefined) {
      queryFilters.is_featured = filters.is_featured;
    }

    return await SupabaseService.findAll(this.TABLE, {
      filters: queryFilters,
      limit,
      offset,
      order
    });
  }

  /**
   * Find a specific member profile by ID
   */
  static async findById(id) {
    return await SupabaseService.findOne(this.TABLE, id);
  }

  /**
   * Create or update member profile
   */
  static async upsert(id, payload) {
    const existing = await this.findById(id);
    if (existing) {
      return await SupabaseService.update(this.TABLE, { id }, payload);
    } else {
      return await SupabaseService.create(this.TABLE, { id, ...payload });
    }
  }

  /**
   * Update specific profile details
   */
  static async update(id, payload) {
    // Exclude status changes for normal users
    const cleanPayload = { ...payload };
    delete cleanPayload.status;
    delete cleanPayload.id;
    
    cleanPayload.updated_at = new Date().toISOString();
    return await SupabaseService.update(this.TABLE, { id }, cleanPayload);
  }

  /**
   * Admin: Approve a member profile
   */
  static async approve(id) {
    const result = await SupabaseService.update(this.TABLE, { id }, { status: 'approved', updated_at: new Date().toISOString() });
    
    // Also promote role from guest to member if currently guest
    const roleRecord = await this.getRole(id);
    if (!roleRecord || roleRecord.role === 'guest') {
      await this.setRole(id, 'member');
    }
    return result;
  }

  /**
   * Admin: Reject a member profile
   */
  static async reject(id) {
    return await SupabaseService.update(this.TABLE, { id }, { status: 'rejected', updated_at: new Date().toISOString() });
  }

  /**
   * Admin: Toggle featured status
   */
  static async toggleFeatured(id, is_featured) {
    return await SupabaseService.update(this.TABLE, { id }, { is_featured, updated_at: new Date().toISOString() });
  }

  /**
   * Admin: Delete user permanently (cascades to member_profiles)
   */
  static async deletePermanently(id) {
    return await SupabaseService.deleteAuthUser(id);
  }

  /**
   * Retrieve all roles
   */
  static async findAllRoles() {
    return await SupabaseService.findAll(this.ROLES_TABLE, { limit: 5000 });
  }

  /**
   * Retrieve role for a user
   */
  static async getRole(userId) {
    return await SupabaseService.findOne(this.ROLES_TABLE, userId);
  }

  /**
   * Update or set a user's role
   */
  static async setRole(userId, role) {
    const existing = await this.getRole(userId);
    const updated_at = new Date().toISOString();
    
    if (existing) {
      return await SupabaseService.update(this.ROLES_TABLE, { id: userId }, { role, updated_at });
    } else {
      return await SupabaseService.create(this.ROLES_TABLE, { id: userId, role, updated_at });
    }
  }
}

module.exports = Member;
