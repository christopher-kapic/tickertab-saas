import { useContext } from "react";
import { InputContext } from "../context/InputStore";
import { BlackScholes, IVAdjuster, TimeToExpiration } from "@/components/calculator/utils/cellUtils"
const styles = {
    width: 220,
    height: 120,
    minWidth: 220,
    maxWidth: 220,
    minHeight: 120,
    maxHeight: 120,
    margin: 4,
    backgroundColor: "#222230",
    borderRadius: 4,
    padding: 4,
}

const OptionCell = (props) => {
    const [input, setInput] = useContext(InputContext);
    const { option, stockPrice, expiration } = props;
    if ( option === null || option.expirationDate === undefined) {
        return (
            <div style={styles}>
                <p></p>
            </div>
        )
    }
    return (
        <div style={styles}>
            <p>Expiration: {option.expirationDate}</p>
            <p>Strike: {option.strike}</p>
            <p>Last Price: {option.lastPrice}</p>
            { input.prediction.date === undefined ? <></> : 
              <p>Prediction: {BlackScholes("call", stockPrice, input.prediction.price, TimeToExpiration(new Date(expiration), input.prediction.date), 0.03, IVAdjuster(input.prediction.impliedVolatility))}</p>
            }
        </div>
    )
}

export default OptionCell