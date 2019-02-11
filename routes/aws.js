var express = require('express');
var router = express.Router();
var AWS = require('../helpers/AWSHelper.js');

router.get('/', function(req, res, next){
   AWS.AWS_S3_HANDLE.getObject({
       Bucket : AWS.AWS_S3_VIDEO_BUCKET,
       Key : "meta-data/test.json"
   }, (err, data)=> {
       if(err) return next(err);
       res.send(data.Body.toString())
   })
});

module.exports = router;