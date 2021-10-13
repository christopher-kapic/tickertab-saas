import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { getData } from '@/utils/helpers';
import styles from '../../styles/Calculator.module.css';
import { is_test } from '@/utils/is-test';
import Graph from '@/components/calculator/Graph';
// import { useState } from 'react';

// Uncomment for testing
import { testdata } from '@/utils/test-data'
import { HistoricalsContext, ChainContext } from '@/components/context/DataStore';
// import { InputContext } from '@/components/context/InputStore';

const Wrapper = () => {
  // Create context to share data between graph components
  const [historicals, setHistoricals] = useContext(HistoricalsContext)
  const [chain, setChain] = useContext(ChainContext)
  // const [input, setInput] = useContext(InputContext) // Not updating input from this component.
  // Query the given stock
  const router = useRouter();
  const { ticker } = router.query
  const { userLoaded, user, session, userDetails, subscription } = useUser();

  // useEffect(() => {
  //   console.log("Historicals:", historicals)
  //   console.log("Chain:", chain)
  // }, [historicals, chain])

  useEffect(() => {
    if (userLoaded) {
      if (!user) {
        router.replace('/');
      }

      // Uncomment test data for testing. Only ship assuming is_test.
      getData({url: `/api/historicals/${ticker}`, token: session.access_token})
        .then((json) => {
          if (!Boolean(is_test)) {
            setHistoricals({...historicals, historicals: json});
          } else {
            setHistoricals({...historicals, historicals: testdata.historicals});
          }
        })
      
      getData({url: `/api/chain/${ticker}`, token: session.access_token})
        .then((json) => {
          if (!Boolean(is_test)) {
            setChain({...chain, chain: json});
          } else {
            setChain({...chain, chain: testdata.chain})
          }
        })
    }
  }, [user, userLoaded])

  const settings = {
    height: 350,
    width: 980,
    daysBack: 100,
    daysForward: 150,
    paddingTop: 100,
    paddingBottom: 25,
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