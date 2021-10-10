// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

//import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import LoadingDots from '@/components/ui/LoadingDots';
// import Logo from '@/components/icons/Logo';
// import { useUser } from '@/utils/useUser';
// import { getData } from '@/utils/helpers';

// import styles from '../../styles/Calculator.module.css';
// import { is_test } from '@/utils/is-test';

// import Graph from '@/components/calculator/Graph';

// Uncomment for testing
// import { testdata } from '@/utils/test-data'
import DataStore from '@/components/context/DataStore';
import InputStore from '@/components/context/InputStore';
import Wrapper from '@/components/calculator/Wrapper';

const Calculator = () => {

  return (
    <DataStore>
      <InputStore>
        <Wrapper />
      </InputStore>
    </DataStore>
  )
};

export default Calculator;
