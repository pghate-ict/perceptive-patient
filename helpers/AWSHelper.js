const AWS = require("aws-sdk");
const AWS_CREDENTIALS = new AWS.SharedIniFileCredentials();
const AWS_CONFIG = new AWS.Config({
    credentials: AWS_CREDENTIALS,
    region: 'us-west-1'
})
const AWS_S3_HANDLE = new AWS.S3(AWS_CONFIG);
const AWS_EC2_HANDLE = new AWS.EC2(AWS_CONFIG);
const AWS_S3_VIDEO_BUCKET = 'videos.perceptivepatient.org'

AWS.config.logger = console;
module.exports = {
    AWS_CREDENTIALS,
    AWS_S3_HANDLE,
    AWS_EC2_HANDLE,
    AWS_S3_VIDEO_BUCKET,
};