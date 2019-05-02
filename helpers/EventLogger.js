const fs = require('fs')

class EventLogger{
    constructor(){
        this.events = [];
        this.file_name = "events_" + new Date().toDateString() + ".json";

    }

    dump_events(events){
        events.forEach(element => {
            fs.appendFileSync(this.file_name, JSON.stringify(element));
        });
    }

    dump_all(events){
        fs.writeFileSync(this.file_name,JSON.stringify(events));
    }
}
module.exports = EventLogger;