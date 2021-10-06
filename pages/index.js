import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import {useUser} from '@/utils/useUser'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PricingPage({ products }) {
  // const { userLoaded, user, session, userDetails, subscription } = useUser();
  const {user} = useUser();

  const router = useRouter();
  useEffect(() => {
    if (user) router.replace('/calculator');
  }, [user])

  return (
  <>
    <Pricing products={products} />
  </>)
}

export async function getStaticProps() {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
