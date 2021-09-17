import { getUser } from '@/utils/supabase-admin'

const getChain = async (req, res) => {
  const { ticker } = req.query;
  
  if (req.method === 'GET') {
    const token = req.headers.token;

    try {
      const user = await getUser(token);
    //   const customer = await createOrRetrieveCustomer({
    //     uuid: user.id,
    //     email: user.email
    //   });

    //   const { url } = await stripe.billingPortal.sessions.create({
    //     customer,
    //     return_url: `${getURL()}/account`
    //   });

    //   return res.status(200).json({ url });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};


export default getChain;