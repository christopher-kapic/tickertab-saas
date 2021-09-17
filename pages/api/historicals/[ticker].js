import { getUser } from "@/utils/supabase-admin";

const getHistoricals = async (req, res) => {
  const { ticker } = req.query;
  const { token } = req.headers;

  try {
    const user = await getUser(token);

  } catch (err) {
    
  }

}

export default getHistoricals;