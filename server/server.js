const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user Connected');

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat App!',
        createdAt: new Date().getTime()
    });         // this code not working

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined the chat!',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', function (message) {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});

module.exports = {app};