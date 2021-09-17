import { createClient } from '@supabase/supabase-js';

// Template
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Template
export const getUser = async (token) => {
  const { data, error } = await supabaseAdmin.auth.api.getUser(token);

  if (error) {
    throw error;
  }

  return data;
};

export const getSubscription = async (user_id) => {
  const { data, error } = await supabaseAdmin.from('subscriptions').select(`status, user_id, price_id, prices (
    product_id,
    products (
      id, name
    )
  )`).eq('user_id', user_id).order('created', { ascending: false }).limit(1);

  if (error) {
    throw error;
  }

  return data;
}