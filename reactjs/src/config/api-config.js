// let backendHost;
// const apiVersion = 'v1';

/* const hostname = window && window.location && window.location.hostname;
if (hostname === process.env.REACT_APP_MAIN_DOMAIN) {
  backendHost = process.env.REACT_APP_BACKEND_HOST;
} else if (hostname === process.env.REACT_APP_HOSTNAME_DEV) {
  backendHost = process.env.REACT_APP_BACKEND_HOST_DEV;
} else if (/^qa/.test(hostname)) {
  backendHost = `https://api.${hostname}`;
} else {
  backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:8001';
} */

export const API_ROOT = `${process.env.REACT_APP_BACKEND_HOST}/api/`;
