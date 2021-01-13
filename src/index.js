const path = require('path')
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const filterBadWords = require('bad-words');
const { generateMessage } = require('./utils/message');
const {generateLocation}= require('./utils/message');
const {addUser,removeUser,getUser,getUsersInRoom}= require('./utils/users');

const app = express();
const server = http.createServer(app);
//configuring  socketio to the server.
const io = socketio(server);

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log("New websocket connection");
    
    //listeing to "join" event sent from client side
    socket.on('join',(options,callback)=>{
        console.log({ id:socket.id,...options})
        //adding user 
        const {error,user} = addUser({ id:socket.id, ...options})
        // console.log(user)
        // console.log(error)
        if(error){
            return callback(error)
        }
        //creates a room with name value containing in room
        socket.join(user.room);
        //welcoming user to the room
        socket.emit("message",generateMessage('welcome','Admin'));

        //broadcasting a event to everyone in the room
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`,'Admin'));
        //sending Room name and users in the room i.e emitting "sideBarInfo" event when a user joins the room
        io.to(user.room).emit('sideBarInfo',{
            users:getUsersInRoom(user.room),
            room:user.room
        });
        callback();


    })
 
    //emits a event expect to the current socket/connection/client/user
    socket.on('newMessage',(message,callback)=>{
        const user = getUser(socket.id);
        const filter = new filterBadWords();
        if(filter.isProfane(message)){
            return callback('profanity not allowed')
        }
        io.to(user.room).emit('message',generateMessage(message,user.username));
        callback("message sent succesfully");
    })
     
    //when a socket is disconnected
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message",generateMessage(`${user.username} has left`,'Admin'));
             //sending Room name and users in the room i.e emitting "sideBarInfo" event when a user leaves the room
            io.to(user.room).emit('sideBarInfo',{
                users:getUsersInRoom(user.room),
                room:user.room
            })
        }
    });

    //receiving location services
    socket.on('sendLocation',(locationCoordinates)=>{
        console.log('location cordinates',locationCoordinates);
        const user = getUser(socket.id)
        // console.log("user",user.username)
        io.to(user.room).emit('locationMessage',generateLocation(`https://google.com/maps?q=${locationCoordinates.latitude},${locationCoordinates.longitude}`,user.username));
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
