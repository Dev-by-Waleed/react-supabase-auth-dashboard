import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing. Check Netlify Environment Variables settings.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const logActivity = async (uid, type, desc) => {
    if (!uid) return;
    const { error } = await supabase
        .from('activities')
        .insert([{ user_id: uid, action_type: type, description: desc }]);
    if (error) console.error("Error logging activity:", error);
};