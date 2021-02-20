import React, { Component } from "react"
import "./Header.css"
import { Link } from "react-router-dom"
import axios from "axios"
import { connect } from "react-redux"
import { updateUser } from "../../Redux/reducer"
import LogOut from "./LogOut.png"

export class Header extends Component{
    constructor(props){
        super(props)
        this.state = {
            user:null
        }
    }

    componentDidUpdate = (prevProps) =>{
        if(this.props.user.email != prevProps.user.email){

            this.setState({
                user:this.props.user
            })
        }
    }

    logout = () =>{
        axios.post("/logout").then(response =>{
            this.setState({user:null})
            this.props.socket.emit('logout');
        })
    }

    render(){
        return(
            <header className ="header">
                    <div className = "logo">Connect</div>
                    <div className = "UserInfo">
                    { this.state.user? <h3>{this.state.user.first_name  + " " + this.state.user.last_name}</h3>: null}
                    { this.state.user? <Link to = "/" ><button className ="goBack" onClick = {this.logout}><img src = {LogOut}></img></button></Link>:null }
                    </div>
            </header>
        )
    }
}

const mapStateToProps = (reducerState) =>{
    return{
        user:reducerState.user
    }
}

export default connect(mapStateToProps,{updateUser})(Header)