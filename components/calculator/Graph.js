import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataStore";
import { InputContext } from "../context/InputStore";

const Graph = ({settings}) => {
  const [data, setData] = useContext(DataContext)
  const [input, setInput] = useContext(InputContext)

  const { height, width, daysBack, daysForward, paddingTop, paddingBottom, green, red, backgroundColor } = settings;

  useEffect(() => {
    const tdata = data;
    setData(tdata);
    const tinput = input;
    setInput(tinput)
  }, [data, input])

  return (
    <div style={{
      height: height,
      width: width,
      backgroundColor: backgroundColor,
      borderRadius: 4,
      boxShadow: '0px 1px 2px 1px #222222',
      cursor: 'crosshair'
    }}>
    </div>
  )
}

export default Graph;