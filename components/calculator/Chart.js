import { useEffect, useContext, useState } from "react";
import { ChainContext } from "../context/DataStore";
import styles from "@/styles/Chart.module.css";
import table_from_json from "./utils/chartUtils";
import OptionCell from "./OptionCell";

const Chart = () => {
    const [chain, setChain] = useContext(ChainContext);
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
                                            return (<OptionCell option={opt} key={idx}/>)
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