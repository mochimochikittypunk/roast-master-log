import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = async (clerkToken: string | null) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const options = clerkToken
        ? {
            global: {
                headers: {
                    Authorization: `Bearer ${clerkToken}`,
                },
            },
        }
        : {};

    return createClient(supabaseUrl, supabaseAnonKey, options);
};
