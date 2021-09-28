import { getSubscription, getUser, getHistoricalsFromDatabase } from "@/utils/supabase-admin";



const getHistoricalsCheckCache = async (ticker) => {
  let historicals = await getHistoricalsFromDatabase(ticker);
  const lastEOD = new Date();
  if (historicals === null || historicals.updated_at /**/) {
    //fetch
    //upsert historicals
    //return historicals
  }
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


  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: { statusCode: 500, message: err.message } });
  }
}

export default getHistoricals;