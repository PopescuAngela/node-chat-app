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
    socket.on('disconnect', (socket)=>{
        console.log('The user disconnected');
    });
});

var port = process.env.PORT || 3000;
server.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {server}
