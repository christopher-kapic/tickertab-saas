import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataStore";
import { InputContext } from "../context/InputStore";

const Graph = ({settings}) => {
  const [data, setData] = useContext(DataContext)
  const [input, setInput] = useContext(InputContext)

  const { height, width, daysBack, daysForward, paddingTop, paddingBottom, green, red, backgroundColor } = settings;

  return (
    <div style={{
      height: height,
      width: width,
      backgroundColor: backgroundColor,
      borderRadius: 4,
      boxShadow: '0px 1px 2px 1px #222222',
      cursor: 'crosshair'
    }}>
      Hello World {settings.green}, this is {JSON.stringify(data)}
    </div>
  )
}

export default Graph;