import { useState, createContext } from "react";

export const HistoricalsContext = createContext();
export const ChainContext = createContext();

const DataStore = ({ children }) => {
  const [chain, setChain] = useState({})
  const [historicals, setHistoricals] = useState({})

  return (
    <ChainContext.Provider value={[chain, setChain]}>
      <HistoricalsContext.Provider value={[historicals, setHistoricals]}>
        {children}
      </HistoricalsContext.Provider>
    </ChainContext.Provider>
  )
}

export default DataStore;