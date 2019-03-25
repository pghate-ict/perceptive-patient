/* This is the Standard Patient API Helper class, that allows the 
user to query for SessionID and subscribe to the queue of events for that session ID*/

const WebSocket = require('ws');
const url = require('url');
const axios = require('axios');
const SPSAPI_URL = 'http://dev1.scp.standardpatient.org/scpatient/api/interaction';
const Queue = require('./Queue');

// var LongPoller = require("../helpers/LongPoller");
// var spsEventPoller = new LongPoller();

/* Variable to keep track of number of requests to SPS so far */
var n = 0;

/* Tracking different types of client */
var wsClientMap = {
    perceptive : null
};

/* This queue keeps track of events found by proxy but cannot send to perceptive client yet */
const EventBuffer = new Queue();

/* Starting web socket server as a proxy to send events to Perceptive Client etc */
const wss = new WebSocket.Server({
    port: 4040
});

wss.on('connection', (ws, req) => {
    let token = url.parse(req.url, true).query.token;
    ws.id = token;
    if(token == 'perceptive'){
        wsClientMap.perceptive = ws;
        //Check for any events in the EventBuffer first
        if(!EventBuffer.isEmpty()){
            console.log("Dumping Event Buffer!");
            while(!EventBuffer.isEmpty()){
                wsClientMap.perceptive.send(JSON.stringify(EventBuffer.dequeue()));
            }
            
        }
    }
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

/* END WEB SOCKET STUFF */



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
        try {

            console.log(`Listening to Events! (${n++})`);
            let response = await SPSAPI.getRunningEvent(session_id, event_id);

            if (response.data.spsStreamEvents !== '') {
                let sorted_event_array = this.flatten_sort(response.data.spsStreamEvents);
                console.log("Event Data Received");
                if(wsClientMap.perceptive != null){
                    sorted_event_array.forEach(event => {
                       wsClientMap.perceptive.send(JSON.stringify(event));
                    });
                } else {
                    console.log("Event Data in Buffer, waiting for Perceptive Client to connect!");
                    sorted_event_array.forEach(event=>{
                        EventBuffer.enqueue(event);
                    })
                }
            } else {
                console.log("Event Data not found, trying again!");
            }

            this.poll(session_id, event_id);
        } catch (error) {
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


module.exports = {
    SPSAPI: SPSAPI,
    SPSHelper: new SPSHelper()
};