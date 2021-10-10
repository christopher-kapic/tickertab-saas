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
