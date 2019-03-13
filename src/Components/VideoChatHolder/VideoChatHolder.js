import React, {Component} from "react"
import { connect } from "react-redux";
import { updateVideo } from "../../Redux/reducer";
import "./VideoChatHolder.css"
import { Link } from "react-router-dom"

export class VideoChatHolder extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    reconnect = () =>{
        this.props.socket.emit("reConnect")
    }

    render(){
        console.log("Props: ", this.props)
        return(
            <div className ="Video-Parent">
                <p className = "name">Video chat is not supported yet :(</p>
                <Link to ="/dashboard"><button onClick = {this.reconnect}> Cancel </button></Link>
            </div>
        )
        
    }
    
}
const mapStateToProps = (state) =>{

    return{
        toggleVideo:state.toggleVideo,
        socket:state.socket
    }
}
export default connect(mapStateToProps,{updateVideo})(VideoChatHolder)