//var API_KEY = document.getElementById("apikey").value;
var yVals = new Array();
var yMax = Math.max(yVals);
var yMin = Math.min(yVals);
var yDifference=undefined;
var yValsGraph = new Array();
var canvasHeight = 300;
var canvasMargin = 50;
var iv = 0;
var interest = 0;
var strikeprice = 0;
var expiration = undefined;
var timeRemaining = undefined;
var mouseTimeRemaining=undefined;
var mouseprice=undefined;


//math functions... Thank you @Bertjan Broeksema. <3

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
      k = 1 / (1 + .2316419 * x);
      return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2*Math.PI) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
    }
}

var bs_price=0;
var call = true;

var mouse = {
    x: undefined,
    y: undefined
};

function putCallFlag(){
    if (call) {
        call = false;
        document.getElementById("putcallflag").innerHTML = "Put";
    } else {
        call = true;
        document.getElementById("putcallflag").innerHTML = "Call";
    }
}

function get_bs_price(){
    mouseprice = ((canvasHeight - mouse.y)-canvasMargin)*(yDifference/(canvasHeight - (2 * canvasMargin)))+yMin;
    mouseTimeRemaining = timeRemaining - ((mouse.x - 250)/(2.5*365));
    //console.log(timeRemaining);
    //console.log(mouseTimeRemaining);
    if (call) {
        //console.log('mouseprice: ' + mouseprice);
        let d1 = (((Math.log(mouseprice/strikeprice)) + ((interest + ((((iv*iv)/2))))*mouseTimeRemaining)) / (iv * (Math.sqrt(timeRemaining))));// update later

        let d2 = d1 - (iv * Math.sqrt(timeRemaining));//(((Math.log(mouseprice/strikeprice)) + ((interest - ((((iv*iv)/2))))*mouseTimeRemaining)) / (iv * (Math.sqrt(timeRemaining))));// update later

        bs_price = (mouseprice * CND(d1)) - ((strikeprice/(Math.pow((Math.E),((interest * mouseTimeRemaining)))))*CND(d2));
        //console.log('bs_price: ' + bs_price);
        mouseprice=mouseprice.toFixed(2);
    } else {
        let d1 = (((Math.log(mouseprice/strikeprice)) + ((interest + ((((iv*iv)/2))))*mouseTimeRemaining)) / (iv * (Math.sqrt(timeRemaining))));// update later

        let d2 = d1 - (iv * Math.sqrt(timeRemaining));
        bs_price = ( strikeprice * Math.exp(-interest * mouseTimeRemaining) * CND(-d2) - mouseprice * CND(-d1) );
        mouseprice=mouseprice.toFixed(2);
    };
};


function get_time_remaining(){
    timeRemaining = ((expiration.getTime() - Date.now())/(1000*60*60*24)+1)/365;// - Date.now();
};

var my_canvas = document.getElementById("option-calc");

my_canvas.addEventListener('mousemove', function(event){
    var rect = my_canvas.getBoundingClientRect();
    mouse.x = event.x - rect.left;
    mouse.y = event.y - rect.top;
    my_iv();
    get_bs_price();
    // console.log(bs_price);
});

// my_canvas.addEventListener('scroll', function(event){
//     console.log(event);
// })

function my_iv(){
    var canvas = document.querySelector('canvas');
    var c = canvas.getContext('2d');
    c.clearRect(249, 0, 500, 300);
    if (mouse.x > 254) {
        c.beginPath();
        c.moveTo(250, yValsGraph["99"]);
        c.lineTo(mouse.x, mouse.y);
        if (mouse.y > yValsGraph["99"]){
            c.strokeStyle='#c74242';
        } else {
            c.strokeStyle='#42c775';
        };
        c.stroke();
    }
    c.beginPath();
    c.moveTo(250 + (2.5*timeRemaining*365),0);
    c.lineTo(250 + (2.5*timeRemaining*365),300);
    c.strokeStyle='#b8b8b8';
    c.stroke();

    document.getElementById("price").innerHTML = "Stock price: " + mouseprice;//.toFixed(2);
    document.getElementById("option-price").innerHTML = "Option price: " + bs_price.toFixed(2);
};

function my_animate(){
    var canvas = document.querySelector('canvas');
    var c = canvas.getContext('2d');
    c.clearRect(0,0,500,300);

    c.beginPath();
    c.moveTo(0, yValsGraph["0"]);
    for (let i = 0; i < 100; i++) {
        let yhelp = toString(i);
        let y = yValsGraph[i];
        // console.log(y);
        c.lineTo(2.5 * i, y);
    };
    // c.lineTo(0,yValsGraph["0"]);
    // c.lineTo(1,yValsGraph["1"]);
    // c.lineTo(2,yValsGraph["2"]);

    if (yValsGraph["0"]<yValsGraph["99"]){
        c.strokeStyle='#c74242';
    } else {
        c.strokeStyle='#42c775';
    };
    c.lineWidth=3;
    c.stroke();
};

function updateData(){
    var stock = document.getElementById('ticker').value;
    $.getJSON('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+stock+'&apikey=E03KDCGQR1000SI6', function(data){
        var yVals = new Array();
        for (var dat in data["Time Series (Daily)"]){
            let toAdd = (data["Time Series (Daily)"][dat]["4. close"]);
            yVals.push(parseFloat(toAdd));
        };
        yVals.reverse();
        yMin = Math.min(...yVals);
        yMax = Math.max(...yVals);
        yDifference = (yMax - yMin);
        // console.log(yDifference);
        yValsGraph = yVals.map(x => (canvasHeight - (((x - yMin)*((canvasHeight - 2 * canvasMargin)/yDifference))+canvasMargin ))); //(x - yMin) * (300 / yDifference)
        // console.log(yValsGraph);
        my_animate();
    });
    iv = document.getElementById("iv").value * .01;
    interest = document.getElementById("interest").value * .01;
    strikeprice = document.getElementById("sp").value;
    expiration = new Date(document.getElementById("expiration").value);
    get_time_remaining();
};

window.addEventListener("keydown", function(e){
    if (e.keyCode === 13) {
        updateData();
    };
});