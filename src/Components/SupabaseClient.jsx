import { createClient } from '@supabase/supabase-js';
// This will return undefined if the .env is in the wrong folder!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single, exportable instance
export const supabase = createClient(supabaseUrl, supabaseKey);

export const logActivity = async (uid, type, desc) => {
    if (!uid) return;
    const { error } = await supabase
        .from('activities')
        .insert([{ user_id: uid, action_type: type, description: desc }]);
    if (error) console.error("Error logging activity:", error);
};