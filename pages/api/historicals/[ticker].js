import { getSubscription, getUser, getHistoricalsFromDatabase, supabaseAdmin } from "@/utils/supabase-admin";
import { next4PMNYCISOString } from "@/utils/helpers";

const getFromDate = (daysBack) => {
  let today = new Date();
  today.setDate(today.getDate() - daysBack);
  return today.toISOString().split('T')[0]
}

const getHistoricalsCheckCache = async (ticker) => {
  const now = new Date();
  let historicals = await getHistoricalsFromDatabase(ticker.toUpperCase());
  if (historicals === null || new Date(historicals[0].updated_at) < now) {
    console.log(`Cache miss: ${ticker.toUpperCase()}`)
    // fetch
    const apires = await fetch(`https://eodhistoricaldata.com/api/eod/${ticker.toUpperCase()}.US?api_token=${process.env.EODHISTORICAL_KEY}&fmt=json&from=${getFromDate(140)}`, {
      method: "GET"
    }).catch((err) => {console.log(err)})
    const apijson = await apires.json()
    const next_expiration = new Date(next4PMNYCISOString())

    //upsert historicals
    // const {data, error} = await supabaseAdmin.from('historicals')
      // .upsert({ticker: ticker, historical: apijson, expires_at: next_expiration})

    try {
      await supabaseAdmin.from('historicals').insert({ticker: ticker.toUpperCase(), historical: apijson, expires_at: next_expiration});
    } catch {
      await supabaseAdmin.from('historicals').update({ticker: ticker.toUpperCase(), historical: apijson, expires_at: next_expiration}).match({ticker: ticker.toUpperCase()});
    }
    // await supabaseAdmin.from('historicals').delete().match({ticker: ticker.toUpperCase()})
    //return historicals
    return {ticker: ticker.toUpperCase(), historical: apijson, expires_at: next_expiration}
  }
  console.log(`Cache hit: ${ticker.toUpperCase()}`)
  return historicals[0]
}

const getHistoricals = async (req, res) => {
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

    const result = await getHistoricalsCheckCache(ticker)

    return (res.status(200).json(result))


  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: { statusCode: 500, message: err.message } });
  }
}

export default getHistoricals;