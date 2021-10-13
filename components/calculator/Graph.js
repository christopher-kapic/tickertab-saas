import { useContext, useEffect, useState, useRef } from "react";
import { HistoricalsContext } from "../context/DataStore";
import { InputContext } from "../context/InputStore";
import { yToPrice, xToDate, dateToX, priceToY } from "./utils/graphUtils";

const Graph = ({settings}) => {
  const [historicals, setHistoricals] = useContext(HistoricalsContext)
  const [input, setInput] = useContext(InputContext)
  const [mousePos, setMousePos] = useState({x: null, y: null})
  const [isMouseLive, setIsMouseLive] = useState(true)
  const [isGreen, setIsGreen] = useState(true) // true for green
  const [priceLimits, setPriceLimits] = useState({high: 1000, low: 0})
  const [boundingRect, setBoundingRect] = useState({})
  const ref = useRef();

  const { height, width, daysBack, daysForward, paddingTop, paddingBottom, green, red, backgroundColor } = settings;

  useEffect(() => {
    try {
      let high = 0;
      let low = Infinity;
      historicals.historicals.historical.forEach(historical => {
        if (historical.close > high) {
          high = historical.close;
        }
        if (historical.close < low) {
          low = historical.close
        }
      });
      setPriceLimits({high: high, low: low})
    } catch {
      console.log(historicals)
    }
    try {
      console.log("ref", ref)
      setBoundingRect(ref.current.getBoundingClientRect());
    } catch {
      console.log("Loading bounding rect...")
    }
  }, [historicals])

  return (
    <div style={{
      height: height,
      width: width,
      backgroundColor: backgroundColor,
      borderRadius: 4,
      boxShadow: '0px 1px 2px 1px #222222',
      cursor: 'crosshair',
      color: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      { historicals.historicals === undefined ?
        <p style={{fontSize: 64}}>Loading...</p>
        :
        <svg height={height} width={width} ref={ref}
          onClick={(e) => {
            setIsMouseLive(false);
            setMousePos({x: e.clientX - boundingRect.x + 1, y: e.clientY - boundingRect.y + 1})
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsMouseLive(true);
            setMousePos({x: e.clientX - boundingRect.x + 1, y: e.clientY - boundingRect.y + 1});
          }}
          onMouseLeave={() => {
            if (isMouseLive) {
              setMousePos({x: null, y: null})
            }
          }}
          onMouseMove={(e) => {
            if (isMouseLive) {
              setMousePos({x: e.clientX - boundingRect.x + 1, y: e.clientY - boundingRect.y + 1});
            }
          }}
          >
          {historicals.historicals.historical.map((historical, idx) => {
            if (idx === 0) {
              return (<line key={idx}></line>)
            }
            return(
              <line 
              x1={dateToX(historicals.historicals.historical[idx - 1].date, width, daysBack, daysForward)}
              y1={priceToY(historicals.historicals.historical[idx - 1].close, height, paddingTop, paddingBottom, priceLimits)}
              x2={dateToX(historical.date, width, daysBack, daysForward)}
              y2={priceToY(historical.close, height, paddingTop, paddingBottom, priceLimits)}
              style={{strokeWidth: 2}}stroke={isGreen ? green : red}
              key={idx}/>
            )
          })}
          { mousePos.x === null ? <></> :
          <line 
          x1={dateToX(historicals.historicals.historical[historicals.historicals.historical.length - 1].date, width, daysBack, daysForward)}
          y1={priceToY(historicals.historicals.historical[historicals.historicals.historical.length - 1].close, height, paddingTop, paddingBottom, priceLimits)}
          x2={mousePos.x}
          y2={mousePos.y}
          style={{strokeWidth: 2}}stroke={isGreen ? green : red}
          />}
        </svg>
        }
    </div>
  )
}

export default Graph;