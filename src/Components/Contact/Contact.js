import React, { Component } from "react"
import "./Contact.css"
import { connect } from "react-redux"
import chatImg from "./chatImg.png"
import moreImg from "./moreImg.png"
import contactImg from "./add-contact.png"
import axios from "axios"
import { updateUser, updateToggleSearchBar, updateConnectionInformation, updateChatHistory, FriendUpdate } from "../../Redux/reducer";


export class Contact extends Component{
    constructor(props){
        super(props)
        this.state = {
            users:[],
            toggleMore:false,
            room:""
        }
        props.socket.on("connectionInformation", connectionInformation =>{
            console.log("connection information: ", connectionInformation)
                props.updateConnectionInformation(connectionInformation)
            //When clicking the chat button, get all the history the two users have together.
            // console.log("this is what im sending", this.connectionInformation.room)

            console.log("Sending this room to get data for" , connectionInformation.room)
            axios.get(`/chatHistory/${connectionInformation.room}`).then(response =>{
                console.log(" Got response back. All chat data between these users: ", response.data)
                this.props.updateChatHistory(response.data)
            })
        })
        
    }
    componentDidUpdate = (prevProps, prevState) =>{
        if(this.props.users.email != prevProps.users.email){

            this.setState({
                users:this.props.users
            })
        }
    }
    toggleMoreMenu =() =>{
        this.setState({
            toggleMore: !this.state.toggleMore
        })
    }
    //
    connectToUser = (userToContactInformation, userInformation) =>{
        console.log(this.props)
        // make initial request to make the connection and grab room data. this request is sending current user information and the user to contact's information
        // so we can see if there is a room that they are both in
        // we expect the response to be a room_name we can pull data from

        let body = {userToContactInformation,userInformation}
        console.log("user to contact:",body.userToContactInformation, "user initiating connection: ", body.userInformation)
        this.props.socket.emit("ConnectToUser", body )
        this.props.updateToggleSearchBar(false)
        this.props.getMutualfn()
        
    }

    addFriend = (user_id) =>{
        console.log("This user", this.props.user)
        console.log("wants to connect to this user",user_id)
        
        axios.get(`/api/findUser/${user_id}`).then(response =>{
            let userData = response.data

            let connectionPayload = {
                addTo:this.props.user.user_id,
                userData:userData
            }

            console.log("Sending", connectionPayload)
            axios.put(`/api/addFriend`, connectionPayload).then(response =>{
                console.log("Added friend, here's your new information: ", response.data)
                // this.props.updateUser(response.data)
            })
            axios.get(`/getFriends/${this.props.user.user_id}`).then(response =>{
                this.props.FriendUpdate(response.data)
            })
        })
    }

    render(){
        console.log("Props in contact before destructuring contact", this.props)
        const { first,last,image,status,dept,user_id,user } = this.props
        
        const userInformation = {
            first_name:user.first_name,
            user_id:user.user_id
        }
        const userToContactInformation = {
            user_id,
            first
        }

        const moreMenu = (
            <div className = {this.state.toggleMore? "moreMenu":"hidden"}>
                <p>Status: {status}</p>
            </div>
        )

        
        return(
            <div className = "contact-box">
                <div className = "individual-contact">
                        <img className = "profile-pic" src = {image}></img>
                    <p>{first + " " + last}</p>

                    <div className = "contact-buttons">
                        <button onClick = {() => this.connectToUser(userToContactInformation, userInformation)} className = "message-button"><img src = {chatImg}></img></button>
                        <button onClick = {this.toggleMoreMenu} className = "more-button"><img src = {moreImg}></img></button>
                        <button onClick = {() => this.addFriend(user_id)}className = "Add-contact"><img src = {contactImg}></img></button>
                    </div>

                </div>
                    {this.state.toggleMore? moreMenu : null}    
            </div>
        )
        
    }
}

const mapStateToProps = (reducerstate) =>{
    return{
        users:reducerstate.usersConnected,
        toggleSearchBar:reducerstate.toggleSearchBar,
        user:reducerstate.user,
        connectionInformation:reducerstate.connectionInformation
    }
}


export default connect(mapStateToProps , {updateUser, updateToggleSearchBar, updateConnectionInformation, updateChatHistory, FriendUpdate})(Contact)

