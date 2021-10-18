import { useEffect, useContext, useState } from "react";
import { ChainContext } from "../context/DataStore";
import { HistoricalsContext } from "../context/DataStore";
import styles from "@/styles/Chart.module.css";
import table_from_json from "./utils/chartUtils";
import OptionCell from "./OptionCell";

const Chart = () => {
    const [chain, setChain] = useContext(ChainContext);
    const [historicals, setHistoricals] = useContext(HistoricalsContext);
    const [nChain, setNChain] = useState({});

    useEffect(() => {
        if (chain.chain !== undefined) {
            setNChain(table_from_json(chain.chain, true))
        }
    }, [chain])
  
    return (
        <div className={styles.chartwrapper}>
            {
                (nChain.grid === undefined) ? <p>Loading...</p> : <>
                    {
                        nChain.grid.map((row, id) => {
                            return(
                                <div key={id} style={{display: 'flex'}}>
                                    {
                                        row.map((opt, idx) => {
                                            if (historicals.historical === undefined) {
                                                return <OptionCell option={opt} stockPrice={100} key={idx}/>
                                            }
                                            return (<OptionCell option={opt} stockPrice={historicals.historical[historicals.historical.length - 1].close} /*>expiration={}>*/ key={idx}/>)
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </>
            }
        </div>
    )
}

export default Chart;