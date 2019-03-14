import React, { Component } from "react"
import ChatBoard from "../ChatBoard/ChatBoard";
import SearchSideBar from "../SearchSideBar/SearchSideBar";
import "./Container.css"
import {connect} from "react-redux"
import socketIOClient from 'socket.io-client';
import {updateSocket} from "../../Redux/reducer"

const socket = socketIOClient();


export class Container extends Component{
    constructor(props){
        super(props)
        this.state={

        }
        props.updateSocket(socket)
    }
    render(){
        return(
            <div className = "body">
                <ChatBoard socket = {socket}/>
                <SearchSideBar socket = {socket}/>
            </div>
        )
    }
}
export default connect(null, {updateSocket})(Container)