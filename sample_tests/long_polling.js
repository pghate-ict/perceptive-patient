const request = require('request');
const EVENTID = '9999'
const SESSION = '17366'
const URL = 'http://dev1.scp.standardpatient.org/scpatient/api/interaction/'+SESSION+'/stream2/since/'+EVENTID;

request({
    method : 'GET',
    uri : URL,
    timeout : 45000
},(error, response, body)=>{
    if(error){
        console.log('ERROR', error);
        return;
    }

    console.log(body);
})