import { useState, createContext } from "react";

export const DataContext = createContext();

const DataStore = ({ children }) => {
  const [data, setData] = useState({})

  return (
      <DataContext.Provider value={[data, setData]}>{children}</DataContext.Provider>
  )
}

export default DataStore;