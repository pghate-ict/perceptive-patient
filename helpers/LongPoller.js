const axios = require('axios');

var LongPoller = {
    
    data : {
        last_response : null,
        request_uri : null,
        poll_timeout : 30000,
    },
    
    pollOnce = async () => {
        if(!request_uri){
            throwError("Request URI Empty, Please provide URI Endpoint!")
            return;
        }
        
        try {
            const response = axios.get(request_uri);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    },

    throwError = (err) => {
        console.log("ERROR FROM LONGPOLLER ->", err);
    }
}

module.exports = LongPoller;

