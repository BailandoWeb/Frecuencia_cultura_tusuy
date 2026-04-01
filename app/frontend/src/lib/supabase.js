import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ncljftgmtadpkvmtxbxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbGpmdGdtdGFkcGt2bXR4Ynh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTQxODcsImV4cCI6MjA5MDEzMDE4N30.L2V599Mr876410LitF64STa5BNs0PY01mkKrT_Yhcs4';

export const supabase = createClient(supabaseUrl, supabaseKey);
