const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in backend .env. Operating with placeholder connections.');
}

// Admin client that bypasses Row Level Security (RLS) for server-side management
const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseServiceKey || 'placeholder-service-key'
);

module.exports = { supabaseAdmin };
