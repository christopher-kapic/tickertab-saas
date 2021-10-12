import { useContext, useEffect } from "react";
import { HistoricalsContext } from "../context/DataStore";
import { InputContext } from "../context/InputStore";

const Graph = ({settings}) => {
  const [historicals, setHistoricals] = useContext(HistoricalsContext)
  const [input, setInput] = useContext(InputContext)

  const { height, width, daysBack, daysForward, paddingTop, paddingBottom, green, red, backgroundColor } = settings;

  // useEffect(() => {
  //   // const tdata = data;
  //   // setData(tdata);
  //   // const tinput = input;
  //   // setInput(tinput)
  //   // console.log(historicals)
  // }, [historicals, input])

  return (
    <div style={{
      height: height,
      width: width,
      backgroundColor: backgroundColor,
      borderRadius: 4,
      boxShadow: '0px 1px 2px 1px #222222',
      cursor: 'crosshair',
      color: '#000',
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center'
    }}>
      { historicals.historicals === undefined ?
        <p style={{fontSize: 64}}>Loading...</p>
        :
        <p style={{fontSize: 64}}>Loaded</p>}
    </div>
  )
}

export default Graph;