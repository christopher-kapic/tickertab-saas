import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingDots from '@/components/ui/LoadingDots';
import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';

import styles from '../../styles/Calculator.module.css';

const Calculator = () => {
  const [ticker, setTicker] = useState('');

  return (
    <div className={styles.searchwrapper}>
      <h1>Search</h1>
      <div style={{width: 100}} onKeyPress={(e) => {
        if (e.code === "Enter")
        location.href = `/calculator/${ticker}`;
      }}>
        <Input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={setTicker}
          required
        />
      </div>
    </div>
  )
};

export default Calculator;
