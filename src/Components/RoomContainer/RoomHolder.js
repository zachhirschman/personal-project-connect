import React, {Component} from "react"
import "./RoomHolder.css"
import { connect } from "react-redux"


export class RoomHolder extends Component{
    constructor(props){
        super(props)
        this.state = {
            chatHistory:[]
        }
    }
    render(){
        const {currentUser} = this.props
        let chatMapped = [];
        // console.log("Video toggle: ", this.props.toggleVideo)
        if(this.props.chatHistory.length){
            chatMapped = this.props.chatHistory.map(message =>{
                return(
                                        
                    <div className = {this.props.currentUser.user_id !== message.sender? "reciever-container":"sender-container"}>
                        <p>{message.message}</p>
                    </div>
                    
                )
            })
        }
        console.log(this.props)
        return(
            <div className = "parent-roomContainer">
                
               {/* {this.props.typeMessage? <p className = "name">{this.props.typeMessage}</p> : null} */}
     {chatMapped.length? chatMapped:<p>No history with this user, say hi!</p>}
            </div>
        )
    }
}
const mapStateToProps = (reducerState) =>{
    return{
        chatHistory:reducerState.chatHistory,
        currentUser:reducerState.user
    }
}

export default connect(mapStateToProps , null)(RoomHolder)
//{this.props.currentUser.user_id == message.sender || this.props.currentUser.user_id == message.recipient? "sender-container":"reciever-container"}