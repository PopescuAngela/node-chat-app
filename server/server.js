const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message')
var publicPath = path.join(__dirname, '../public');
var {isRealString} =  require('./utils/validation');
var {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
// set the middleware the public file path
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected', users.getExistingRooms());

    socket.emit('existingRooms', users.getExistingRooms());

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || (!isRealString(params.room) && !isRealString(params.existingRoom))){
           return callback('Name of room name are required');
        }

        var roomName;
        if(params.room === null){
            roomName = params.existingRoom.toLowerCase();
        } else {
            roomName = params.room.toLowerCase();
        }
        console.log(roomName);
       
        var user = users.getUserByName(params.name);
        
        if(user){
            console.log(`User ${params.name} already exists!`);
            return callback('The user name already exists');
        }
        
        // join a special space
        socket.join(roomName);
        users.removeUser(socket.io);
        users.addUser(socket.id, params.name, roomName);

        io.to(roomName).emit('updateUserList', users.getUserList(roomName));
      
        // //send from server to client
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

        // send a message to everybody expect the current user
        socket.broadcast.to(roomName).emit('newMessage',  generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });
    
    socket.on('createMessage', (newMessage, callback) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(newMessage.text)) {
            io.to(user.room).emit('newMessage',  generateMessage(user.name, newMessage.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id);
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', ()=>{
        console.log('The user disconnected');
        var user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} user has left.`));
        }

        // socket.leave(abc);
    });
    
});

var port = process.env.PORT || 3000;
server.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {server}
