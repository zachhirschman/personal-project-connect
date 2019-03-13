## Pseudocode for connection
- user comes to app, signs up, and then joins own room.
- user is put into database. And their presence is emited to everyone accross all rooms.


## Socket.io findings

- both sides emit and listen to events
- to start a socket: io.on("connection", (socket) =>{})  ==> Socket is the line that connects client to server.
-