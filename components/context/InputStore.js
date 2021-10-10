import { useState, createContext } from "react";

export const InputContext = createContext();

const InputStore = ({ children }) => {
  const [input, setInput] = useState({
    prediction: {
      seconds: undefined,
      price: undefined,
      impliedVolatility: 10
    },
    settings: {
      weightIVs: false, // Implied Volatilities - set true when time to implement
      weightROCs: false, // Rate of changes - set true when time to implement
      brokerage: 'robinhood',
      chat: false, // set true when time to implement
      chartDataType: 'price', // [price, priceChange, percentChange]
    },
});

  return (
      <InputContext.Provider value={[input, setInput]}>{children}</InputContext.Provider>
  )
}

export default InputStore;