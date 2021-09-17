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
  return (
    <div className={styles.calculatorwrapper}>
    </div>
  )
};

export default Calculator;
