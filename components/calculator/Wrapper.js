// import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

//import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import LoadingDots from '@/components/ui/LoadingDots';
// import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';
import { getData } from '@/utils/helpers';

import styles from '../../styles/Calculator.module.css';
import { is_test } from '@/utils/is-test';

import Graph from '@/components/calculator/Graph';

// Uncomment for testing
import { testdata } from '@/utils/test-data'
import { DataContext } from '@/components/context/DataStore';
import { InputContext } from '@/components/context/InputStore';
const Wrapper = () => {
  // Create context to share data between graph components
  const [data, setData] = useContext(DataContext)
  const [input, setInput] = useContext(InputContext)
  // Query the given stock
  const router = useRouter();
  const { ticker } = router.query
  const { userLoaded, user, session, userDetails, subscription } = useUser();


  useEffect(() => {
    if (userLoaded) {
      if (!user) {
        router.replace('/');
      }

      // Uncomment test data for testing. Only ship assuming is_test.
      getData({url: `/api/historicals/${ticker}`, token: session.access_token})
        .then((json) => {
          if (!Boolean(is_test)) {
            setData({...data, historicals: json});
          } else {
            setData({...data, historicals: testdata.historicals});
          }
        }).then(() => {
          const tdata = data;
          setData(tdata)
        }).then(() => {console.log("Historicals", data)})
      
      getData({url: `/api/chain/${ticker}`, token: session.access_token})
        .then((json) => {
          if (!Boolean(is_test)) {
            setData({...data, chain: json});
          } else {
            setData({...data, chain: testdata.chain})
          }
        }).then(() => {console.log("Chain", data)})
    }
  }, [user, userLoaded])

  const settings = {
    height: 350,
    width: 980,
    daysBack: 100,
    daysForward: 150,
    paddingTop: 50,
    paddingBottom: 50,
    green: '#59C76A',
    red: '#C75959',
    backgroundColor: '#cccccc'
  }


  return (
      <>
        <div className={styles.calculatorwrapper}>
          <Graph settings={settings}/>
        </div>
      </>
  )
}

export default Wrapper;