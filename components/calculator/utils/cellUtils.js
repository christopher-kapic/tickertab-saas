/*
  PutCallFlag: Either "put" or "call"
  S: Stock Price
  X: Strike Price
  T: Time to expiration (in years)
  r: Risk-free rate
  v: Volatility
  This is the same one found in http://www.espenhaug.com/black_scholes.html
  but written with proper indentation and a === instead of == because it's
  faster, and it doesn't declare 5 useless variables (although if you really
  want to do it to have more elegant code I left a commented CND function in
  the end)
*/

export const TimeToExpiration = (d1, d2) => {
    const s1 = d1.getTime();
    const s2 = d2.getTime();
    const dif = Math.abs(s2 - s1);
    const secdif = dif / 1000;
    const yeardif = secdif / 31536000;
    return yeardif;
}

export const IVAdjuster = (IV) => {
    const adjusted = IV / 100;
    return adjusted;
}


// /**
//  * 
//  * @param {String} PutCallFlag "call" or "put"
//  * @param {Number} S Stock Price
//  * @param {Number} X Strike Price
//  * @param {Number} T Time to expiration
//  * @param {Number} r Risk-free rate
//  * @param {Number} v Volatility
//  * @returns {Number} Price
//  */
// export function BlackScholes(PutCallFlag, S, X, T, r, v) {
//     console.log("S", S, "X", X, "T", T, "r", r, "v", v)
//     let d1 = (Math.log(S / X) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
//     let d2 = d1 - v * Math.sqrt(T);
//     if (PutCallFlag === "call") {
//         return ( S * CND(d1)-X * Math.exp(-r * T) * CND(d2) );
//     } else {
//         return ( X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1) );
//     }
// }
  
// /* The cummulative Normal distribution function: */
// function CND(x){
//     if(x < 0) {
//         return ( 1-CND(-x) );
//     } else {
//         let k;
//         k = 1 / (1 + .2316419 * x);
//         return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2*Math.PI) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
//     }
// }
  
  
  /*
    With the "a" variables
  function CND(x){
    var a1 = .31938153,
        a2 = -.356563782,
        a3 = 1.781477937,
        a4 = -1.821255978,
        a5 = 1.330274429;
    if(x<0.0) {
      return 1-CND(-x);
    } else {
      k = 1.0 / (1 + 0.2316419 * x);
      return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2*Math.PI) * k * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5)))) );
    }
  }
  */









function erf(x) {
    // save the sign of x
    var sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
  
    // constants
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;
  
    // A&S formula 7.1.26
    var t = 1.0/(1.0 + p*x);
    var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y; // erf(-x) = -erf(x);
};

function cdf(x, mean, variance) {
    return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
};

function std_n_cdf(x) {
    return cdf(x, 0, 1);
};


//thanks @Steve Zelaznik
function normal(x, mu, sigma) {
    return stdNormal((x-mu)/sigma);
}

function stdNormal(z) {
    var j, k, kMax, m, values, total, subtotal, item, z2, z4, a, b;

    // Power series is not stable at these extreme tail scenarios
    if (z < -6) { return 0; }
    if (z >  6) { return 1; }

    m      = 1;        // m(k) == (2**k)/factorial(k)
    b      = z;        // b(k) == z ** (2*k + 1)
    z2     = z * z;    // cache of z squared
    z4     = z2 * z2;  // cache of z to the 4th
    values = [];

    // Compute the power series in groups of two terms.
    // This reduces floating point errors because the series
    // alternates between positive and negative.
    for (k=0; k<100; k+=2) {
        a = 2*k + 1;
        item = b / (a*m);
        item *= (1 - (a*z2)/((a+1)*(a+2)));
        values.push(item);
        m *= (4*(k+1)*(k+2));
        b *= z4;
    }

    // Add the smallest terms to the total first that
    // way we minimize the floating point errors.
    total = 0;
    for (k=49; k>=0; k--) {
        total += values[k];
    }

    // Multiply total by 1/sqrt(2*PI)
    // Then add 0.5 so that stdNormal(0) === 0.5
    return 0.5 + 0.3989422804014327 * total;
}

function CND(x){
  if(x < 0) {
    return ( 1-CND(-x) );
  } else {
    const k = 1 / (1 + .2316419 * x);
    return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2*Math.PI) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
    }
}

/**
 * @param {Boolean} call true if call, false if put
 * @param {Number} S Stock Price
 * @param {Number} X Strike Price
 * @param {Number} T Time to expiration (years)
 * @param {Number} r Risk-free rate
 * @param {Number} v Volatility
 * @returns {Number} Price
 */
export function BlackScholes(call, S, X, T, r, v){
    //S = ((canvasHeight - mouse.y)-canvasMargin)*(yDifference/(canvasHeight - (2 * canvasMargin)))+yMin;
    //T = timeRemaining - ((mouse.x - 250)/(2.5*365));
    let bs_price;
    if (call) {
        let d1 = (((Math.log(S/X)) + ((r + ((((v*v)/2))))*T)) / (v * (Math.sqrt(T))));// update later

        let d2 = d1 - (v * Math.sqrt(T));//(((Math.log(mouseprice/strikeprice)) + ((interest - ((((iv*iv)/2))))*mouseTimeRemaining)) / (iv * (Math.sqrt(timeRemaining))));// update later

        bs_price = (S * CND(d1)) - ((X/(Math.pow((Math.E),((r * T)))))*CND(d2));
    } else {
        let d1 = (((Math.log(S/X)) + ((r + ((((v*v)/2))))*T)) / (v * (Math.sqrt(T))));// update later

        let d2 = d1 - (iv * Math.sqrt(T));
        bs_price = ( X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1) );
    };
    return bs_price.toFixed(2);
};


function get_time_remaining(){
    timeRemaining = ((expiration.getTime() - Date.now())/(1000*60*60*24)+1)/365;// - Date.now();
};