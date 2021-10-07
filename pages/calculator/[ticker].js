import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, createContext, useMemo } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingDots from '@/components/ui/LoadingDots';
import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';
import { getData } from '@/utils/helpers';

import styles from '../../styles/Calculator.module.css';
import DataContext from '@/components/context/DataContext';

const Calculator = () => {
  // Create context to share data between graph components
  const [data, setData] = useState({});
  const value = useMemo(() => ({
    data,
    setData
  }), [data]);
  
  // Query the given stock
  const router = useRouter();
  const { ticker } = router.query
  const { userLoaded, user, session, userDetails, subscription } = useUser();


  useEffect(() => {
    console.log('loading')
    console.log(user)
    if (userLoaded) {
      console.log('loaded')
      console.log(session)
      if (!user) {
        router.replace('/');
      }

      getData({url: `/api/historicals/${ticker}`, token: session.access_token})
        .then((json) => {
          let tdata = data;
          tdata.historicals = json;
          setData(tdata);
        })
      
      getData({url: `/api/chain/${ticker}`, token: session.access_token})
        .then((json) => {
          let tdata = data;
          tdata.chain = json;
          setData(tdata);
        }).then(() => {console.log(data)})
    }

    

  }, [user, userLoaded])


  return (
    <DataContext.Provider value={value}>
      <div className={styles.calculatorwrapper}>
        <h1>{ticker}</h1>
      </div>
    </DataContext.Provider>
  )
};

export default Calculator;
