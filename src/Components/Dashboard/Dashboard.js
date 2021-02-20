import React, { Component } from "react"
import "./Dashboard.css"
import Profile from "../Profile/Profile";
import Container from "../Container/Container"

export default class Dashboard extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className = "DashContainer">
                <Profile/>
                <Container socket={this.props.socket}/>
            </div>
        )
    }
}
