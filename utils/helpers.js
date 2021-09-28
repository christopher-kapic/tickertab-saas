export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ''
      ? process.env.URL
      : process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ''
      ? process.env.VERCEL_URL
      : 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};

export const postData = async ({ url, token, data = {} }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (res.error) {
    throw error;
  }

  return res.json();
};

export const getData = async ({ url, token }) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token}),
    credentials: 'same-origin',
  });

  if (res.error) {
    throw error;
  }

  return res.json();
}

export const toDateTime = (secs) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const next4PMNYCISOString = () => {
  const now = new Date();
  const now_est_es = now.toLocaleString("es", { timeZone: "America/New_York" });
  const nyc_hour = now_est_es.split(" ")[1].split(":")[0];
  const offset = (16 + 24 - nyc_hour) % 24;
  const n4pm = () => {
    const tom_offset = new Date(now.setHours(now.getHours() + offset));
    return tom_offset.toISOString().split(":")[0] + ":00:00.000Z";
  };
  return n4pm()
};