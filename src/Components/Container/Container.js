import React, { Component } from "react"
import ChatBoard from "../ChatBoard/ChatBoard";
import SearchSideBar from "../SearchSideBar/SearchSideBar";
import "./Container.css"
import {connect} from "react-redux"
import {updateSocket} from "../../Redux/reducer"


export class Container extends Component{
    constructor(props){
        super(props)
        props.updateSocket(this.props.socket)
    }
    render(){
        return(
            <div className = "body">
                <ChatBoard socket = {this.props.socket}/>
                <SearchSideBar socket = {this.props.socket}/>
            </div>
        )
    }
}
export default connect(null, {updateSocket})(Container)