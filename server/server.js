const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
// set the middleware the public file path
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected');
    
    // //send from server to client
    socket.emit('newMessage', {
        from : 'Admin',
        text: 'Welcome to the chat',
        createdAt: new Date().getTime()
    });

    // send a message to everybody expect the current user
    socket.broadcast.emit('newMessage', {
            from: 'Admin',
            text: 'New user joined',
            createdAt: new Date().getTime()
        });

    // listen
    socket.on('createMessage', (newMessage) => {
        console.log('createMessage', newMessage);
        //send message to each client connected
        io.emit('newMessage', {
            from: newMessage.from,
            text: newMessage.text,
            createdAt: new Date().getTime()
        });

        //send a message to everybody expect the current user
        // socket.broadcast.emit('newMessage', {
        //     from: newMessage.from,
        //     text: newMessage.text,
        //     createdAt: new Date().getTime()
        // });
    });1

    socket.on('disconnect', (socket)=>{
        console.log('The user disconnected');
    });
    
});

var port = process.env.PORT || 3000;
server.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {server}
