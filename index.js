var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// var rm = require("./ChatRoom")
var req = require("request")

var userList = new Set;
var adminSocket = null;

io.on('connection', (socket) => {

    console.log("서버 올라감");

    socket.on("login", function (userName) {
        users = '';

        if (userName === 'admin') {
            adminSocket = socket;
            userList.add("admin")

            adminSocket.emit("anumberOfConnection", userList.size)
            userList.forEach(i => users += i + ",")
            adminSocket.emit("userList", users)

        } else {
            if (adminSocket) {

                userList.add(userName)
                adminSocket.emit("anumberOfConnection", userList.size)
                userList.forEach(i => users += i + ",")
                adminSocket.emit("userList", users)

            }
        }
    })

    socket.on("logout", function (userName) {
        console.log(userName+"이 나감");
        
        userList.delete(userName);
        adminSocket.emit("anumberOfConnection", userList.size)
        userList.forEach(i => users += i + ",")
        adminSocket.emit("m-logout", userName)
    })

})


http.listen(3000, function () {
    console.log('listening on *:3000');
});