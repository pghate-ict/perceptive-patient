/* This is the Standard Patient API Helper class, that allows the 
user to query for SessionID and subscribe to the queue of events for that session ID*/

const WebSocket = require('ws');
const url = require('url');
const axios = require('axios');

const SPSAPI_URL = 'http://dev1.scp.standardpatient.org/scpatient/api/interaction';


// var LongPoller = require("../helpers/LongPoller");
// var spsEventPoller = new LongPoller();


const wss = new WebSocket.Server({
    port: 4040
});

wss.on('connection', (ws, req) => {
    let token = url.parse(req.url, true).query.token;
    ws.id = token;
    console.log("Client Connected of type->", token);
})


const WSS = {
    getPerceptiveClient: () => {
        let client = [...wss.clients].find(client => {
            return client.id == 'perceptive';
        })
        return client;
    }
}



const SPSAPI = {
    getRunningSessionId: async () => {
        try {
            let response = await axios.get(SPSAPI_URL + '/session/mine');
            let session_id = response.data;
            return session_id;
        } catch (err) {
            console.error(err);
        }
    },

    getRunningEvent: async (session_id, event_id) => {
        try {
            return axios.get(SPSAPI_URL + '/' + session_id + '/stream2/since/' + event_id);
        } catch (err) {
            console.log(err);
        }
    },

    dequeueEvent: () => {
        //zmq client to consume messages for client to access over rest
        let event = EventQueue.dequeue();
        return event;
    }
}



class SPSHelper {

    constructor() {
        this.subscribers = new Object(); // A Key value paiting of String - Integer. <SessionID,EventID>
    }


    handleRequest(session_id) {
        if (this.isSubscribed(session_id)) {

        } else {
            console.error("Invalid Session ID");
        }
    }

    //This function takes care of publishing session_ids coming from Perceptive Patient
    async p_subscribe(session_id) {

        try {
            let current_session_id = await SPSAPI.getRunningSessionId();
        } catch (err) {
            console.error(err);
        }


        if (session_id != null) {
            this.subscribers[session_id] = 0;
        } else {
            this.subscribers[current_session_id] = 0;
        }

        console.log("Subscribed!")
    }

    //This function takes care of removal of the above subscription
    async p_unsubscribe(session_id) {
        try {
            let current_session_id = await SPSAPI.getRunningSessionId();
        } catch (err) {
            console.error(err);
        }

        if (session_id != null) {
            this.subscribers[session_id] = -1;
        } else {
            this.subscribers[current_session_id] = -1;
        }

        console.log("Unsubscribed!");
    }


    async poll(session_id, event_id) {
        try{
            let response = await SPSAPI.getRunningEvent(session_id, event_id);
        
            if (response.data.spsStreamEvents !== '') {
                let sorted_event_array = this.flatten_sort(response.data.spsStreamEvents);
                console.log("Event Data Received");
                let perceptive_client = WSS.getPerceptiveClient();
                console.log(perceptive_client);
                if(perceptive_client){
                    sorted_event_array.forEach(event => {
                        perceptive_client.send(JSON.stringify(event));
                    });
                }
                this.poll(session_id, event_id);
            }
        } catch(error){
            console.log("ERROR->", error);
        }
        
    }

    /*Sorts events in response data by event_id, converting it into an array of events*/
    flatten_sort(event_data) {
        var sorted_event_array = [];
        for (var event in event_data) {
            if (Array.isArray(event_data[event])) {
                event_data[event].forEach(element => {
                    sorted_event_array.push(Object.assign(element, {
                        eventType: event
                    }));
                });
            } else {
                sorted_event_array.push(Object.assign(event_data[event], {
                    eventType: event
                }));
            }
        }

        sorted_event_array.sort((a, b) => {
            return a.id > b.id
        });

        return sorted_event_array;
    }

    isSubscribed(session_id) {
        return this.subscribers[session_id] >= 0;
    }

    pushEventArray(eventArray) {
        console.log("Pushing Event Array to AMQ");
        eventArray.forEach(event => {
            EventQueue.enqueue(event);
            console.log(event.id);
        })
    }
}


new SPSHelper().poll(17381, 0).catch(err => console.log(err));

module.exports = {
    SPSAPI: SPSAPI,
    SPSHelper: new SPSHelper()
};