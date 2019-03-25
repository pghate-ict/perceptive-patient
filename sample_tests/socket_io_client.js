const io = require('socket.io-client');
const client = io.connect("ws://localhost:4040/?token=perceptive");

client.on('message', (message)=>{
    console.log(message);
})