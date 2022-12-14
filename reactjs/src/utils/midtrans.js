const midtransClient = require('midtrans-client');
// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: process.env.REACT_APP_MT_IS_PRODUCTION,
  serverKey: process.env.REACT_APP_MT_SERVER_KEY,
  clientKey: process.env.REACT_APP_MT_CLIENT_KEY
});

export default snap;
