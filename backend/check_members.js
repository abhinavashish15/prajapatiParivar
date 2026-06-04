require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkData() {
  console.log('Fetching members...');
  const { data, error } = await supabase.from('member_profiles').select('*');
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : 0);
  console.log('Data:', data);
}

checkData();
