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

export const getHistoricalsFromDatabase = async (ticker) => {
  try {
    const { data, error } = await supabaseAdmin.from('historicals').select().eq('ticker', ticker.toUpperCase()).limit(1);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return null;
    }

    return data
  } catch (err) {
    console.log(err);
  }
}

export const getChainFromDatabase = async (ticker) => {
  try {
    const { data, error } = await supabaseAdmin.from('chains').select().eq('ticker', ticker.toUpperCase()).limit(1);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return null;
    }

    return data
  } catch (err) {
    console.log(err);
  }
}
