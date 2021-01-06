const path = require('path')
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const filterBadWords = require('bad-words');

const app = express();
const server = http.createServer(app);
//configuring  socketio to the server.
const io = socketio(server);

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));
var count = 0;

io.on('connection',(socket)=>{
    console.log("New websocket connection");

    socket.emit("message","Welcome");
    // socket.emit('countUpdated',count);

    // socket.on('increment',()=>{
    //     count++;
    //     io.emit('countUpdated',count);
    // });
    //emits a event expect the current socket/connection/client/user
    socket.broadcast.emit("message","A new user is added");

    socket.on('newMessage',(message)=>{
        socket.emit('message',message);
    })

    socket.on('disconnect',()=>{
        io.emit("message","A user has left");
    });

    //receiving location services
    socket.on('sendLocation',(locationCoordinates)=>{
        socket.broadcast.emit('message',`https://google.com/maps?q=${locationCoordinates.latitude},${locationCoordinates.longitude}`);
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
