import { getSubscription, getUser } from "@/utils/supabase-admin";

const getHistoricals = async (req, res) => {
  const { ticker } = req.query;
  const { token } = req.headers;

  try {
    const user = await getUser(token);
    const subscription = await getSubscription(user.id);
    console.log(subscription)

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