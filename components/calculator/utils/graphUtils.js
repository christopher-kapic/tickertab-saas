export const dateToX = (date, width, daysBack, daysForward) => {
    let d = new Date(date);
    // let td = new Date(new Date().toLocaleDateString("en-CA"));
    let back = new Date(new Date().toLocaleDateString("en-CA"));
    back.setDate(back.getDate() - daysBack);
    const totalDays = daysForward + daysBack;
    const pixelsPerDay = width / totalDays;
    const daysInto = (d.getTime() - back.getTime()) / 86400000;
    const pixels = daysInto * pixelsPerDay;
    return pixels;
}

export const xToDate = (x, width, daysBack, daysForward) => {
    let td = new Date(new Date().toLocaleDateString("en-CA"));
    let back = td;
    back.setDate(back.getDate() - daysBack);
    const totalDays = daysForward + daysBack;
    const daysPerPixel = totalDays / width;
    const daysInto = x * daysPerPixel;
    const toReturn = new Date(back.getTime() + (daysInto * 86400000))
    return toReturn
}

export const priceToY = (price, height, paddingTop, paddingBottom, priceLimits) => {
    const availablePixels = height - paddingTop - paddingBottom;
    const priceDelta = priceLimits.high - priceLimits.low;
    const pixelPerDollar = availablePixels / priceDelta;
    const yUnadjusted = (price - priceLimits.low) * pixelPerDollar;
    const yAdjusted = yUnadjusted + paddingBottom;
    const toReturn = height - yAdjusted;
    return toReturn;
}

export const yToPrice = (y, height, paddingTop, paddingBottom, priceLimits) => {
    const availablePixels = height - paddingBottom - paddingTop;
    const priceDelta = priceLimits.high - priceLimits.low;
    const dollarsPerPixel = priceDelta / availablePixels;
    const trueY = height - y;
    const unadjustedY = trueY - paddingBottom;
    const price = (unadjustedY * dollarsPerPixel) + priceLimits.low;
    return price;
}