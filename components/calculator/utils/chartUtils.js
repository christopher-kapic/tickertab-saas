function transpose(matrix) {
    const rows = matrix.length, cols = matrix[0].length;
    const grid = [];
    for (let j = 0; j < cols; j++) {
      grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[j][i] = matrix[i][j];
      }
    }
    return grid;
}
  
/**
 * @param {Object} chain_json Results from chain cloud function
 * @param {Boolean} call True if call, false if put
 * @returns {List} strike_prices
 */
const get_strike_prices = (chain_json, call) => {
  let strike_prices = []
  chain_json.chain.data.map((exp) => {
    if (call) { // calls
      exp.options['CALL'].map((strike) => {
        if (!strike_prices.includes(strike.strike)) {
          strike_prices.push(strike.strike)
        }
      })
    } else { // puts
      exp.options['PUT'].map((strike => {
        if (!strike_prices.includes(strike.strike)) {
          strike_prices.push(strike.strike)
        }
      }))
    }
  })
  // strike_prices.sort(); // This sorts alphabetically, not numerically.
  strike_prices.sort((a,b) => {
    const a_num = parseFloat(a)
    const b_num = parseFloat(b)
    return (a_num - b_num)
  })
  return strike_prices;
}
  
/**
 * @param {Object} chain_json 
 * @returns { Array } List of expirations dates for an option chain
 */
const get_expiration_dates = (chain_json) => {
  let to_return = []
  chain_json.chain.data.map((exp) => {
    to_return.push(exp["expirationDate"]);
  })
  return to_return;
}

/**
 * This could still be improved (for time complexity, etc.)
 * @param { Object } chain_json JSON response for EOD option data
 * @param { Boolean } call true for calls, false for puts
 * @return { Object } Object of lists of prices with length(number of expiration dates on the chain)
 */
const table_from_json = (chain_json, call) => {
  const call_string = call ? 'CALL' : 'PUT';
  const exp_dates = get_expiration_dates(chain_json);
  const strike_prices = get_strike_prices(chain_json, call);
  let grid = [];
  // [
  //   [strike prices for first exp date],
  //   [strike prices for second exp date],
  //   [strike prices for third exp date]
  // ]
  for (let i = 0; i < exp_dates.length; i++) {
    let row = []
    for (let j = 0, k = 0; j < strike_prices.length; j++) {
      try {
        if (chain_json.chain.data[i].options[call_string][k].strike === strike_prices[j]) {
          row.push(chain_json.chain.data[i].options[call_string][k]);
          k++;
        } else {
          row.push(null);
        }
      } catch {
        row.push(null);
      }
    }
    grid.push(row);
  }

  grid = transpose(grid);

  const to_return = {
    strike_prices: strike_prices,
    exp_dates: exp_dates,
    grid: grid
  }

  return to_return;
}

export default table_from_json;