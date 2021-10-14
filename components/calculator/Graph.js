import { useContext, useEffect, useState, useRef } from "react";
import { HistoricalsContext } from "../context/DataStore";
import { InputContext } from "../context/InputStore";
import { yToPrice, xToDate, dateToX, priceToY, ivDelta, ivYear } from "./utils/graphUtils";


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
    window.onscroll = () => {
      window.scrollTo({
        top: 0,
        // behavior: "smooth"
      });
    }
  }, []);

  // Set initial implied volatility
  useEffect(() => {
    const maxIV = input.settings.maxIV;
    const pixelsPerIV = 1000 / maxIV;
    try {
      ref.current.scrollTop = 1000 - (input.prediction.impliedVolatility * pixelsPerIV);
    } catch {
      console.log("Loading ref...")
    }
  }, [ref])

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
      setBoundingRect(ref.current.getBoundingClientRect());
    } catch {
      console.log("Loading bounding rect...")
    }
  }, [historicals])

  // useEffect(() => {

  // }, [ref])

  return (
    <div style={{overflowY: "scroll", overflowX: 'hidden', height: height, maxHeight: height, msOverflowStyle: 'none'}}
      class="graphContainer"
      onScroll={() => {
        if (isMouseLive) {
          const maxIV = input.settings.maxIV;
          const curIV = maxIV - ((ref.current.scrollTop / 1000) * maxIV);
          setInput({...input, prediction: {...input.prediction, impliedVolatility: curIV}})
        }
      }}
      ref={ref}>
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
        alignItems: 'center',
        position: 'sticky',
        top: 0
      }}>
        { historicals.historicals === undefined ?
          <p style={{fontSize: 64}}>Loading...</p>
          :
          <svg height={height} width={width}
            onClick={(e) => {
              setIsMouseLive(false);
              setMousePos({x: e.clientX - boundingRect.x + 1, y: e.clientY - boundingRect.y + 1})
              const iv = input.prediction.impliedVolatility;
              setInput({...input, prediction: {
                date: xToDate((e.clientX - boundingRect.x + 1), width, daysBack, daysForward), 
                price: yToPrice((e.clientY - boundingRect.y + 1), height, paddingTop, paddingBottom, priceLimits), 
                impliedVolatility: iv}})
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsMouseLive(true);
              setMousePos({x: e.clientX - boundingRect.x + 1, y: e.clientY - boundingRect.y + 1});
              const iv = input.prediction.impliedVolatility;
              setInput({...input, prediction: {
                date: xToDate((e.clientX - boundingRect.x + 1), width, daysBack, daysForward), 
                price: yToPrice((e.clientY - boundingRect.y + 1), height, paddingTop, paddingBottom, priceLimits), 
                impliedVolatility: iv}})
            }}
            onMouseLeave={() => {
              if (isMouseLive) {
                setMousePos({x: null, y: null})
                const iv = input.prediction.impliedVolatility;
                setInput({...input, prediction: {
                  date: undefined, 
                  price: undefined, 
                  impliedVolatility: iv}})
              }
            }}
            onMouseMove={(e) => {
              if (isMouseLive) {
                setMousePos({x: e.clientX - boundingRect.x + 1, y: e.clientY - boundingRect.y + 1});
                const iv = input.prediction.impliedVolatility;
                setInput({...input, prediction: {
                  date: xToDate((e.clientX - boundingRect.x + 1), width, daysBack, daysForward), 
                  price: yToPrice((e.clientY - boundingRect.y + 1), height, paddingTop, paddingBottom, priceLimits), 
                  impliedVolatility: iv}})
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
            <>
              {/* Prediction */}
              <line 
                x1={dateToX(historicals.historicals.historical[historicals.historicals.historical.length - 1].date, width, daysBack, daysForward)}
                y1={priceToY(historicals.historicals.historical[historicals.historicals.historical.length - 1].close, height, paddingTop, paddingBottom, priceLimits)}
                x2={mousePos.x}
                y2={mousePos.y}
                style={{strokeWidth: 2}}stroke={isGreen ? green : red}
              />
              {/* IV */}
              <line
                x1={mousePos.x}
                y1={mousePos.y}
                x2={mousePos.x + ivYear(width, daysBack, daysForward)}
                y2={mousePos.y + ivDelta(input.prediction.impliedVolatility, input.prediction.price, height, paddingBottom, paddingTop, priceLimits)}
                style={{strokeWidth: 2}} stroke="#aaa"
              />
              <line
                x1={mousePos.x}
                y1={mousePos.y}
                x2={mousePos.x + ivYear(width, daysBack, daysForward)}
                y2={mousePos.y - ivDelta(input.prediction.impliedVolatility, input.prediction.price, height, paddingBottom, paddingTop, priceLimits)}
                style={{strokeWidth: 2}} stroke="#aaa"
              />
            </>
            }
          </svg>
          }
      </div>
      <div style={{height: 1000}}>
      </div>
    </div>
  )
}

export default Graph;