import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rfdbumftrwltpavwlkwv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZGJ1bWZ0cndsdHBhdndsa3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NjMxMTcsImV4cCI6MjA1NTAzOTExN30.FJvJsvqbOnxkhMtiZD9_naVgugRD8XmmNytgfCU_tek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function to check database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Error testing database connection:', error);
    return false;
  }
} 