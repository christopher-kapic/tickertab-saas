import { useEffect, useContext } from "react";
import { ChainContext } from "../context/DataStore";
import styles from "@/styles/Chart.module.css";

const Chart = () => {
    const [chain, setChain] = useContext(ChainContext);

    useEffect(() => {
        console.log(chain.chain)
    }, [chain])
  
    return (
        <div className={styles.chartwrapper}>
        </div>
    )
}

export default Chart;