import React, { Component } from "react"
import "./ChatBoard.css"
import { connect } from "react-redux"
import RoomHolder from "../RoomContainer/RoomHolder";
import goBack from "./goBack.png"
import newPost from "./newPost.png"
import videoCall from "./videoCall.png"
import {  updateToggleSearchBar, updateChatHistory, updateVideo } from "../../Redux/reducer"
import axios from "axios";
import  CommunityPosts from "../CommunityPosts/CommunityPosts";
import { Link } from "react-router-dom"


export class ChatBoard extends Component{
    constructor(props){
        super(props)
        this.state = {
            connectionInformation:"",
            message:"",
            welcome:"",
            roomToggle:false,
            newPost:false,
            toggleVideo:false
        }


        props.socket.on('messageFromServer', message => {
            axios.get(`/chatHistory/${this.props.connectionInformation.room}`).then(response =>{
                // console.log(" Got response back. All chat data between these users: ", response.data)
                if(response.data.length){
                    this.setState({roomToggle:true})
                }
                this.setState({
                    message:""
                    // chatHistory:response.data
                })
                this.props.updateChatHistory(response.data)
            })
        })  

        props.socket.on("welcome", welcome =>{
            // console.log("got welcome")
            this.setState({
                welcome:welcome
            })
        })

    }

    sendMessage = () => {
        //previous
        // let body = {
        //     message:this.state.message,
        //     room:this.props.connectionInformation.room,
        //     sender:this.props.connectionInformation.sender,
        //     recipient:this.props.connectionInformation.recipient
        // }
            let body = {
                message:this.state.message,
                room:this.props.connectionInformation.room,
                sender:this.props.currentUser.user_id,
                recipient:this.props.connectionInformation.recipient
            }
            console.log("Sending: ", body)
            console.log("Connection information before sending message : ", this.props.connectionInformation)
            this.props.socket.emit('message', body);
            
            axios.get(`/chatHistory/${this.props.connectionInformation.room}`).then(response =>{
                // console.log(" Got response back. All chat data between these users: ", response.data)
                if(response.data.length){
                    this.setState({roomToggle:true})
                }
                this.setState({
                    message:""
                    // chatHistory:response.data
                })
                this.props.updateChatHistory(response.data)
            })

        }
    

        
    

    toggleSearch = () =>{
        this.props.updateToggleSearchBar(true)
        this.props.socket.emit("DisconnectFromUser")
        this.props.updateChatHistory({})
        this.setState({
            welcome:""
        })
    }
    toggleNewPost = () =>{
        this.setState({newPost:!this.state.newPost})
    }
    toggleVideo = () =>{
        this.props.socket.emit("logout")
    }

    

    render(){
        
        const { socket } = this.props
        const footer = (<div className = "footer-parent">
        <button className = "send-msg-button" onClick= {this.sendMessage}>Send</button>
        <input className = "message-bar" placeholder = {this.state.welcome} onChange={(e) => this.setState({message: e.target.value})}></input>
    </div>)
        const buttonSet = (
            <div>
                <button className = "goBack" onClick = {this.toggleSearch}><img src = {goBack}></img></button>
                {/* <button className = "goBack" onClick = {this.toggleVideo}><img src = {videoCall}></img></button> */}
                <Link to ="/VideoCall"><button className = "goBack" onClick = {this.toggleVideo}><img src = {videoCall}></img></button></Link>
            </div>
        )
        const { currentUser } = this.props
        console.log(this.props.connectionInformation)
        return(
            <div className = {`Parent-container ${ !this.props.toggleSearchBar ? 'Longer-Parent-Container' : ''}`}>

                <div className = "chat-container-Header">
                        {this.props.toggleSearchBar? <h3>Chatboard</h3> : <h3>Messenger</h3>}
                        {this.props.toggleSearchBar?  <button className = "goBack" onClick = {this.toggleNewPost}><img src = {newPost}></img></button>:buttonSet}
                </div>
                {this.props.toggleSearchBar? <CommunityPosts socket = {socket} currentUser = {currentUser} newPost = {this.state.newPost} toggleNewPostFn = {this.toggleNewPost}/>:<RoomHolder toggleVideo ={this.state.toggleVideo} socket = {socket}/>} 
                
                {this.props.toggleSearchBar? null:footer}
                
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        toggleSearchBar:state.toggleSearchBar,
        connectionInformation:state.connectionInformation,
        currentUser:state.user,
        toggleVideo:state.toggleVideo
    }
    
}


export default connect(mapStateToProps, {updateToggleSearchBar, updateChatHistory, updateVideo})(ChatBoard)

