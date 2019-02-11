/* This is the Standard Patient API Helper class, that allows the 
user to query for SessionID and subscribe to the queue of events for that session ID*/

/* Attempting ZeroMQ */
const zmq = require('zeromq');
const axios = require('axios');


/* ZMQ Initialization */
var sock = zmq.socket('pub');
sock.bindSync('tcp://127.0.0.1:4000');
console.log("Started ZEROMQ Pubserver");



const SPSAPI_URL = 'http://dev1.scp.standardpatient.org/scpatient/api/interaction';

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
            let response = await axios.get(SPSAPI_URL + '/' + session_id + '/stream2/since/' + event_id);
            return response.data.spsStreamEvents;
        } catch (err) {
            console.log(err);
        }
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

    /* One Cycle of Getting an Event Feed and sending through ZeroMQ PUB*/
    async poll(session_id, event_id) {
        try {
            let event_data = await SPSAPI.getRunningEvent(session_id, event_id);
            this.flatten_sort(event_data);

        } catch (err) {
            console.log(err);
        }
    }

    /*Sorts events in response data by event_id, converting it into an array of events*/
    flatten_sort(event_data) {
        var sorted_event_array = [];
        for(var event in event_data){
           if(Array.isArray(event_data[event])){
                event_data[event].forEach(element=>{
                    sorted_event_array.push(Object.assign(element, {eventType:event}));
                });
           } else {
                sorted_event_array.push(Object.assign(event_data[event], {eventType : event}));
           }
        }

        sorted_event_array.sort((a,b)=>{
            return a.id < b.id
        });

        console.log(sorted_event_array);
    }

    isSubscribed(session_id) {
        return this.subscribers[session_id] >= 0;
    }
}

new SPSHelper().poll(17301, 0)