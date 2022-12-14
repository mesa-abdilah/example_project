const aws = require('aws-sdk');

const region = process.env.REACT_APP_AWS_REGION;
const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
});

module.exports = { s3 };
