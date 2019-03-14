import React, { Component } from "react"
import "./ChatBoard.css"
import { connect } from "react-redux"
import RoomHolder from "../RoomContainer/RoomHolder";
import goBack from "./goBack.png"
import newPost from "./newPost.png"
import {  updateToggleSearchBar, updateChatHistory, updateVideo } from "../../Redux/reducer"
import axios from "axios";
import  CommunityPosts from "../CommunityPosts/CommunityPosts";



export class ChatBoard extends Component{
    constructor(props){
        super(props)
        this.state = {
            connectionInformation:"",
            message:"",
            welcome:"",
            roomToggle:false,
            newPost:false,
            toggleVideo:false,
            typeMessage:null
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

    sendMessage = (e) => {
        var code = e.keyCode || e.which;
            let body = {
                message:this.state.message,
                room:this.props.connectionInformation.room,
                user_1:this.props.currentUser.user_id,
                user_2:this.props.connectionInformation.recipient.user_id
            }

            if(code === 13) { 
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
        console.log("connection Information", this.props.connectionInformation)
        const footer = (<div className = "footer-parent">
        {/* <button className = "send-msg-button" onClick= {this.sendMessage}>Send</button> */}
        <input className = "message-bar" placeholder = "Send a message!" onChange={(e) => this.setState({message: e.target.value})} onKeyPress = {(e) =>{this.sendMessage(e)}}></input>
    </div>)
        const buttonSet = (
            <div>
                <button className = "deleteFriend" onClick = {this.toggleSearch}><img src = {goBack}></img></button>
                {/* <Link to ="/VideoCall"><button className = "goBack" onClick = {this.toggleVideo}><img src = {videoCall}></img></button></Link> */}
            </div>
        )
        const { currentUser } = this.props
        return(
            <div className = {`Parent-container ${ !this.props.toggleSearchBar ? 'Longer-Parent-Container' : ''}`}>

                <div className = "chat-container-Header">
                        {this.props.toggleSearchBar? <h3>Chatboard</h3> : <h3>Messenger</h3>}
                        {this.props.toggleSearchBar?  <button className = "goBack" onClick = {this.toggleNewPost}><img src = {newPost}></img></button>:buttonSet}
                </div>
                {this.props.toggleSearchBar? <CommunityPosts socket = {socket} currentUser = {currentUser} newPost = {this.state.newPost} toggleNewPostFn = {this.toggleNewPost}/>:<RoomHolder typeMessage = {this.state.typeMessage} toggleVideo ={this.state.toggleVideo} socket = {socket}/>} 
                
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

