const Crypto = require('crypto-js');
const atob = require('atob');
const btoa = require('btoa');

const secretKey = process.env.REACT_APP_COOKIES_SECRET_ACCESS_KEY;
const keySize = 256;
const ivSize = 128;
const saltSize = 256;
const iterations = 1000;

function hexToBase64(str) {
  return btoa(
    String.fromCharCode.apply(
      null,
      str
        .replace(/\r|\n/g, '')
        .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
        .replace(/ +$/, '')
        .split(' ')
    )
  );
}

function base64ToHex(str) {
  let i = 0;
  let bin = null;
  let hex = null;
  for (i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; i = 1 + i) {
    let tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = `0${tmp}`;
    hex[hex.length] = tmp;
  }
  return hex.join('');
}

const longEncrypt = (message) => {
  const salt = Crypto.lib.WordArray.random(saltSize / 8);

  const key = Crypto.PBKDF2(secretKey, salt, { keySize: keySize / 32, iterations });
  const iv = Crypto.lib.WordArray.random(ivSize / 8);

  const encrypted = Crypto.AES.encrypt(message, key, {
    iv,
    padding: Crypto.pad.Pkcs7,
    mode: Crypto.mode.CBC
  });

  const encryptedHex = base64ToHex(encrypted.toString());

  const base64result = hexToBase64(salt + iv + encryptedHex);

  return base64result;
};

const longDecrypt = (message) => {
  try {
    const hexResult = base64ToHex(message);

    const salt = Crypto.enc.Hex.parse(hexResult.substr(0, 64));
    const iv = Crypto.enc.Hex.parse(hexResult.substr(64, 32));
    const encrypted = hexToBase64(hexResult.substring(96));

    const key = Crypto.PBKDF2(secretKey, salt, {
      keySize: keySize / 32,
      iterations
    });

    const decrypted = Crypto.AES.decrypt(encrypted, key, {
      iv,
      padding: Crypto.pad.Pkcs7,
      mode: Crypto.mode.CBC
    });

    return decrypted.toString(Crypto.enc.Utf8);
  } catch (e) {
    return '0';
  }
};

module.exports = {
  longEncrypt,
  longDecrypt,
  Crypto
};
