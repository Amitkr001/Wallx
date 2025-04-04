import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rlpgokkcfjrnakugljen.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscGdva2tjZmpybmFrdWdsamVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzE5MTQsImV4cCI6MjA1ODcwNzkxNH0.vputwjXKV-fqBtt78d0B6Bdcz2pwP3ZOQaAfiYzY1sk'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
