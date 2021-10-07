import { getSubscription, getUser, getChainFromDatabase, supabaseAdmin } from "@/utils/supabase-admin";
import { next4PMNYCISOString } from "@/utils/helpers";


const getChainCheckCache = async (ticker) => {
  const now = new Date();
  let historicals = await getChainFromDatabase(ticker.toUpperCase());
  if (historicals === null || new Date(historicals[0].updated_at) < now) {
    console.log(`Cache miss: ${ticker.toUpperCase()}`)
    // fetch
    const apires = await fetch(`https://eodhistoricaldata.com/api/options/${ticker.toUpperCase()}.US?api_token=${process.env.EODHISTORICAL_KEY}`, {
      method: "GET"
    }).catch((err) => {console.log(err)})
    const apijson = await apires.json()
    const next_expiration = new Date(next4PMNYCISOString())

    //upsert historicals
    // const {data, error} = await supabaseAdmin.from('historicals')
      // .upsert({ticker: ticker, historical: apijson, expires_at: next_expiration})

    try {
      // await supabaseAdmin.from('chains').insert({ticker: ticker.toUpperCase(), historical: apijson, expires_at: next_expiration})
      // await supabaseAdmin.from('chains').update({ticker: ticker.toUpperCase(), historical: apijson, expires_at: next_expiration})
      await supabaseAdmin.from('chains').insert({ticker: ticker.toUpperCase(), chain: apijson, expires_at: next_expiration})
      // await supabaseAdmin.from('chains').update({})
      // await supabaseAdmin.from('chains').delete().match({ticker: ticker.toUpperCase()})
    } catch {
      await supabaseAdmin.from('chains').update({ticker: ticker.toUpperCase(), chain: apijson, expires_at: next_expiration}).match({ ticker: ticker.toUpperCase() })
    }
    //return historicals
    return {ticker: ticker.toUpperCase(), chain: apijson, expires_at: next_expiration}
  }
  console.log(`Cache hit: ${ticker.toUpperCase()}`)
  return historicals[0]
}

const getChain = async (req, res) => {
  const { ticker } = req.query;
  const { token } = req.headers;

  try {
    const user = await getUser(token);
    const subscription = await getSubscription(user.id);
    // console.log(subscription)
    // console.log(subscription[0].prices)
    // console.log(subscription[0].prices.products)

    if (!subscription || subscription.status === "cancelled") {
      return (res
        .status(403)
        .json({ error: { statusCode: 403, message: "Client does not have an active subscription."}}))
    }

    const result = await getChainCheckCache(ticker)

    return (res.status(200).json(result))


  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: { statusCode: 500, message: err.message } });
  }
}

export default getChain;