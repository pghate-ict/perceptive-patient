const axios = require('axios');

class LongPoller {
    constructor(url, options){
        //url for get request
        this.url = url;
        //options such as timeout and request retries
        if(options){
            this.timeout = options.timeout;
            this.retries = options.retries;
        }

        console.log("LONGPOLLER -> Created new Longpoller!");
    }

    pollOnce(){
        console.log("LONGPOLLER : Requesting.. ");
        return axios.get(this.url);
    }

    async poll(){

        let response = await this.pollOnce();
        if(response.data.spsStreamEvents == ''){
            console.log("LONGPOLLER : No data found, trying again...");
        } else {
            console.log("LONGPOLLER : Data Found!");
        }

        this.poll();
    }

    throwError(){
        console.log("ERROR FROM LONG POLLER->", errMsg);
    }
}

module.exports = LongPoller;