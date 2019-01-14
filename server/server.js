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
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name of room name are required');
        }

        // join a special space
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      
        // //send from server to client
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

        // send a message to everybody expect the current user
        socket.broadcast.to(params.room).emit('newMessage',  generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });
    
    socket.on('createMessage', (newMessage, callback) => {
        console.log('createMessage', newMessage);
        //send message to each client connected
        io.emit('newMessage',  generateMessage(newMessage.from, newMessage.text));
        callback();
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
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
