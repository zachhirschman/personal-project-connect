import React, { Component } from "react"
import "./Dashboard.css"
import Profile from "../Profile/Profile";
import Container from "../Container/Container"
import { connect } from "react-redux"
import VideoChatHolder from "../VideoChatHolder/VideoChatHolder";

export class Dashboard extends Component{
    constructor(){
        super()
    }
    render(){
        const {toggleVideo} = this.props
        return(
            <div className = "DashContainer">
                {/* {toggleVideo? <VideoChatHolder/>:null} */}
                <Profile/>
                <Container/>
            </div>
        )
    }
}
const MapStateToProps = (state) =>{
    return{
        toggleVideo:state.toggleVideo
    }
}
export default connect(MapStateToProps, null)(Dashboard)
