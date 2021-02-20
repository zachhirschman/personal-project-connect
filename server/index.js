const express = require('express');
const app = express();
//Sockets
const server = require('http').createServer(app)
// io.set('origins', '*:*');
const io = require('socket.io')(server)

const bodyParser = require('body-parser');
app.use(bodyParser.json())

//Session
const session = require('express-session')
//Database
const massive = require("massive")
require("dotenv").config()
//Security
const bcrypt = require("bcrypt")
const saltRounds = 12

//Session
app.use(session({
    secret:"secret",
    saveUninitialized:false,
    resave:false
}))

//app use

app.use( express.static( `${__dirname}/../build` ) );

//database
massive(
    process.env.connection_string
).then(db => {
    console.log("Connected to Database")
    app.set("db",db)
}).catch(error =>{console.log(error)})



//sockets
    let connectedUsers = []
    let room = ""
    let mainLobby = "home"
        io.sockets.on('connection', (socket) =>{

            console.log('user connected')
            const db = app.get("db")


            //When a user connects to server, put them in the mainLobby room and emit all connected users to them.
            //wait for a request to be put into a new room, then join that user to the correct room.
            //after leaving that room, put them back into home room
        
            socket.on("NewUser",( newUser =>{

        
                if(newUser.email){
                    console.log("The new user is ",newUser.email)
                    connectedUsers.push({...newUser, [socket.id]:socket.id})

                    room = newUser.user_id
                    console.log("User entering room: " , mainLobby)
                    socket.join(mainLobby, () =>{
                        io.in(mainLobby).emit("UserEnter", connectedUsers)
                    })

                }
                else{
                    console.log("No one there")
                }
            
            }))
        
        // When a user makes a request to connect to another user, check the rooms table to see if there is a room in which both user 1 and user 2 are already in together
        // if there is, select * room_data from that room and serve it up to the current user. 
        // if the two users do not have a room that they are in together, create one and populate the room table with it.

        socket.on('ConnectToUser', body =>{
            console.log("on connect request. LOOK HERE FOR BUG", body)
            const db = app.get("db")
            let room = ""
            console.log("Person that wants to initiate connection: ", body.userInformation.first_name)
            console.log("User id to contact: " , body.userToContactInformation.user_id)

            //look for current user information in connectedUsers array
            let index = connectedUsers.findIndex(user => user["user_id"] == body.userToContactInformation.user_id)
            console.log(index)

            //If the user is online, that is, if the user is in the connected users Array, form a unique roomName that these two users will share, and
            //check to see if that room name already exists.
            // comment out if block to return to previous working version
            if(index != -1){
                console.log(body.userInformation.first_name + " wants to connect with ", connectedUsers[index].first_name + " " + connectedUsers[index].last_name + "!")
                let uniqueRoom = `${body.userInformation.user_id} and ${connectedUsers[index].user_id}s room`
                console.log("User will be sending to room", uniqueRoom)
                db.findRoom([body.userInformation.user_id,connectedUsers[index].user_id]).then(response =>{
                    if(!response.length){
                        console.log("These users have never contacted before!")
                        db.addRoom([body.userInformation.user_id,connectedUsers[index].user_id,uniqueRoom]).then(response =>{
                            console.log("Result of adding room: ",response)
                            socket.leave(mainLobby)
                            socket.join(response[0].room_name)
                            room = response[0].room_name

                            //send id to send to
                            let connectionInformation = {
                                room:room,
                                sender:body.userInformation,
                                recipient:body.userToContactInformation
                            }
                            console.log("Sending connection information now", connectionInformation)
                            io.in(response[0].room_name).emit("connectionInformation", connectionInformation)
                            console.log("Users are in room ", response[0].room_name )
                            //send welcome text
                            let welcome = `Send ${connectedUsers[index].first_name} a message!`
                            io.in(response[0].room_name).emit("welcome", welcome )
                        })
                    }
                    else{
                        console.log("These users have contacted each other before! The room they share is ",response[0].room_name)
                        socket.leave(mainLobby)
                        room = response[0].room_name
                        socket.join(room)
                        //send connectionInformation
                        let connectionInformation = {
                            room:room,
                            sender:body.userInformation,
                            recipient:body.userToContactInformation
                        }

                        console.log("Sending connection information now", connectionInformation)
                        io.in(room).emit("connectionInformation", connectionInformation)
                        console.log("Users are in room ", room )
                        //send welcome text
                        let welcome = `Send ${body.userToContactInformation.first} a message!`
                        io.in(room).emit("welcome", welcome )
                    }
                })
            }
            else{
                console.log("Couldn't find that user")
            }
            
            // socket.leave(mainLobby)
            // socket.join(`/${body.userToContactInformation.user_id}`)
            // io.in(`/${body.userToContactInformation.user_id}`).emit("Id", body.userToContactInformation.user_id)

            // let welcome = `Send ${body.userToContactInformation.first} a message!`
            // io.in(`/${body.userToContactInformation.user_id}`).emit("welcome", welcome )

        })

        socket.on('DisconnectFromUser', () =>{
            socket.leave(room)
            console.log("Leaving room", room)
            socket.join(mainLobby)
            io.in(mainLobby).emit("UserEnter", connectedUsers)
            console.log("Joined, ", mainLobby)
        })
        socket.on("typeMessage", payload =>{
            console.log(payload.room)
            console.log(payload.message)
            io.in(payload.room).emit("newType",payload.message)
        })

        //listen for message from client, send it back
        socket.on('message', (body) => {
            console.log(`${body.user_1} is sending ${body.message} to ${body.user_2} in ${body.room}`)
            // room_name,sender,recipient,message
            db.sendDataToRoom([body.room,body.user_1,body.user_2,body.message]).then(response =>{
                console.log("Response after sending message: ", response[0])
            })

            io.in(body.room).emit('messageFromServer', "A new message was sent");
            io.emit('notification', {sender:body.user_1,recipient:body.user_2})
        })
        socket.on("Like", body =>{
            let count = 0;
            console.log(body.Liker_first + " is Liking " + body.post_id)
            db.get_current_likes(body.post_id).then(response =>{
                count = response[0].like_count +1
                db.addLike([body.post_id,count]).then(response =>{
                    console.log("Sending likes,", response)
                    io.in(mainLobby).emit("newLike", response)
                })
            })
            
        })

        //listen for logout or videochat entrance
        socket.on("logout", () =>{
            console.log("User disconnected!!! ")
            socket.disconnect(true)
        })
        //listen for reconnect
        socket.on("reConnect", () =>{
            console.log("user reconnected")
            socket.open()
        })
        
        socket.on('disconnect', () => {
            // connectedUsers2 = connectedUsers.slice()
            console.log('Removing user from connected Users .... ', connectedUsers);
            let index = connectedUsers.findIndex(user => user[socket.id] == socket.id)
            index != -1? connectedUsers.splice(index,1):console.log("Something's wrong")

            io.in(mainLobby).emit("UserEnter", connectedUsers)
        })

        
        //listen for a new post to be made
        socket.on("newPost", body =>{
            const {first_name,last_name,profile_picture,post_text,post_image} = body
            db.add_user_post([first_name,last_name,profile_picture,post_text,post_image]).then(response =>{
                io.in(mainLobby).emit("NewPostToShow", response)
            })
    
        })
        //Listen for a new comment
        socket.on("newComment", body =>{
            const {post_comment,post_id,poster_first_name,poster_last_name,poster_picture} = body
            db.addComment_to_post([post_comment,post_id,poster_first_name,poster_last_name,poster_picture]).then(response =>{
                io.in(mainLobby).emit("NewCommentToShow", response)
            })
        })
})


app.post("/register", (req,res) =>{
    const db = req.app.get("db")
    const { first_name, last_name,status,profile_picture,department,password,email,friends } = req.body

    bcrypt.hash(password, saltRounds).then(hashedPassword =>{
        db.create_user([first_name, last_name,status,profile_picture,department,hashedPassword,email]).then((response)=>{
            console.log("response",response[0])
            req.session.user = {first_name, last_name,status,profile_picture,department,hashedPassword,email,friends,user_id:response[0].user_id}
            res.status(200).json(req.session.user)
        }).catch(error =>{
            if(error.message.match(/duplicate key/)){
                res.status(409).json("That user already exists.")
            }
            else{
                console.log(req.body)
                console.log(error)
                res.status(500).json("An error occured on the server.")
            }
        })
    })
})

app.post('/login', (req, res) => {
    const db = req.app.get('db')
    const { logEmail, logPassword } = req.body
    db.user_login(logEmail).then(user =>{
  
      if(user.length){ // because array is coming back from database. something to do with arrays being truthy
  
        bcrypt.compare(logPassword, user[0].password).then(passwordMatch =>{
          if(passwordMatch){
            req.session.user = { email: user[0].email, first_name:user[0].first_name, last_name: user[0].last_name,status:user[0].status,profile_picture:user[0].profile_picture,department: user[0].department,messages:user[0].messages, user_id:user[0].user_id, friends:user[0].friends} //setting it equal to username on session
            res.status(200).json(req.session.user)
          }
          else{
            res.status(403).json({message:"Incorrect password"})
          }
        })
      }
      else{
        res.status(403).json({message: "Unknown user"})
      }
    })
    
});

//User endpoints

//get all users
app.get("/api/users", (req,res) =>{
    console.log(req)
    const db = req.app.get("db")
    db.get_users().then(response =>{
        res.status(200).json(response.data)
    })
})

//Get current user Session
app.get("/api/user", (req,res) =>{
    // console.log("Current user Session:",req.session.user)
    res.status(200).json(req.session.user)
})

//update status
app.put("/api/user", (req,res) =>{
    const db = req.app.get("db")
    const {status,id} = req.body
    console.log(status)
    db.update_status([status,id]).then(response =>{
        //add new status to user session
        req.session.user.status = response[0].status
        res.status(200).json(req.session.user)
    })
})

//AddFriend
//Get User Information, then edit friends array with response.
app.get("/api/findUser/:user_id", (req,res) =>{
    const db = req.app.get("db")
    const {user_id} = req.params
    console.log("user_id to find: ", user_id)
    db.findUser(user_id).then(response =>{
        console.log("found user: ",response)
        res.status(200).json(response)
    })
})

app.put("/api/addFriend", (req,res) =>{
    const db = req.app.get("db")
    // console.log("Friend to add: ",req.body.userData[0].first_name)
    // const { user_id } = req.body.userData[0]
    console.log("Information recieved when adding friend: ", req.body)
    //friend_of,first_name,last_name,profile_picture
    db.addFriend([req.body.addTo,req.body.userData[0].first_name,req.body.userData[0].last_name,req.body.userData[0].profile_picture]).then(response =>{
        console.log("Added friend!, ", response)
        res.status(200).json(response)
    })
})
// Get friends list
app.get("/getFriends/:id", (req,res) =>{
    const db = req.app.get("db")
    const { id } = req.params
    console.log("Fetching friends list for this user: ", id)

    db.getFriends(id).then(response =>{
        res.status(200).json(response)
    }).catch(error =>{console.log("error getting friends", error)})
})
//Get Mutual Friends
app.get("/GetMutualFriends/:senderID/:recipientID", (req,res) =>{
    const {senderID,recipientID} = req.params
    const db = req.app.get("db")
    console.log(senderID,recipientID)
    db.get_mutual_friends([senderID,recipientID]).then(response =>{
        res.status(200).json(response)
    })
})

//Get chatHistory
app.get("/chatHistory/:room", (req,res) =>{
    // console.log("room to get data for: " , req.params.room)
    const {room} = req.params
    const db = req.app.get("db")
    db.getRoomData(room).then(response =>{
        // console.log("Chat history",response)
        res.status(200).json(response)
    })
})

// Get community posts
app.get("/GetPosts", (req,res) =>{
    const db = req.app.get("db")
    db.get_community_posts().then(response =>{
        res.status(200).json(response)
    })
})
// Get all comments
app.get("/GetComments", (req,res) =>{
    const db = req.app.get("db")
    db.get_comments().then(response =>{
        // console.log("Sending all comments", response)
        res.status(200).json(response)
    })
})
app.put(`/deleteFriend/:id`, (req,res) =>{
    const db = req.app.get("db")
    const {id} = req.params
    db.deleteFriend(id).then(response =>{
        console.log("sending friends", response)
        res.status(200).json(response)
    })
})



app.post('/logout', (req, res) => {
    req.session.destroy()
    res.status(200).end()
  });


const path = require('path')
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
})


const port = 4000;
server.listen(port, ()=> console.log(`Server listening on port ${port}`));