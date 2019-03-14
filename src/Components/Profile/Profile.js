import React, { Component } from "react"
import "./Profile.css"
import axios from "axios"
import { connect } from "react-redux";
import { updateUser, FriendUpdate } from "../../Redux/reducer"
import deleteFriend from "./deleteFriend.png"

export class Profile extends Component{
    constructor(props){
        super(props)
        this.state = { 
            userInfo:this.props.userInfo,
            toggleStatusUpdate:false,
            newStatus:"",
            friends:[]

        }
    }

    componentDidMount(){
        axios.get("/api/user").then(response =>{
            this.props.updateUser(response.data)
            this.setState({userInfo:response.data})

            axios.get(`/getFriends/${response.data.user_id}`).then(response =>{
                this.props.FriendUpdate(response.data)
            })
            
        })
        
    }
    componentDidUpdate = (prevProps) =>{
        if(this.props.userInfo.email != prevProps.userInfo.email){

            this.setState({
                userInfo:this.props.userInfo
            })
        }
    }

    statusUpdate = () =>{
        let body = {
            status:this.state.newStatus,
            id:this.state.userInfo.email
        }

        axios.put("/api/user", body).then(response =>{
            // trying to update whole user info. might need to change.
            this.props.updateUser(response.data)
            this.setState({
                userInfo:this.props.userInfo,
                toggleStatusUpdate: !this.state.toggleStatusUpdate
            })
        }).catch(error => { console.log("error editing status ")})
    }
    deleteFriend =(id) =>{
        axios.put(`/deleteFriend/${id}`).then(response =>{
            console.log("Deleted friends:", response.data)
        })
        axios.get(`/getFriends/${this.state.userInfo.user_id}`).then(response =>{
            this.props.FriendUpdate(response.data)
        })
    }
    
    render(){
        const { userInfo } = this.state
        const editForm = <div><input className = "status-input" placeholder = "Enter status" onChange = {(e) =>{ this.setState({newStatus:e.target.value})}}></input><button className = "submit-btn" onClick = {this.statusUpdate}>Submit</button></div>
        console.log("Friends in props: ", this.props.contacts)

        let mappedContacts = this.props.contacts.map(contact =>{
            return(
                <div className = "Contact-Parent">
                    <img className = "comment-pic" src = {contact.profile_picture}></img>
                    <p>{contact.first_name + " " + contact.last_name}</p>
                    <button className = "deleteFriend" onClick ={() =>{this.deleteFriend(contact.connection_id)}}><img src = {deleteFriend}></img></button>
                    
                </div>
            )
        })
        let placeholder = (
            <div className = "placeholder">
                <p className = "name">No connections yet. Make some!</p>
            </div>
        )

        
        return(
            <div className = "parent-container">
                <div className = "container-Header">
                    <h3>Profile</h3>
                </div>

                    <div className = "picture-parent">
                <div className = "picture-frame">
                    { this.state.userInfo? <img className = "profile-picture" src = {userInfo.profile_picture}></img>:null}
                </div>
                    </div>

                <div className = "name-bar">
                    <h3>{userInfo.first_name + " " + userInfo.last_name}</h3>
                </div>

                <div className = "about-container">
                    {/* <h3>Department: {userInfo.department}</h3> */}
                    {this.state.toggleStatusUpdate?  editForm : <h3 className = "name">Currently: {userInfo.status} </h3> } <button className = "update-btn" onClick = {() => this.setState({toggleStatusUpdate:!this.state.toggleStatusUpdate})}>Update Status</button>
                </div>

                <div className = "friends-list">
                    <div className = "friends-header">
                        <p>My Contacts</p>
                    </div>
                    <div className = "friendsBody">
                        {this.props.contacts.length? mappedContacts : placeholder}
                    </div>
                        
                </div>


            </div>
        )
    }
}
function mapStateToProps(reducerState){
    return({
        userInfo:reducerState.user,
        contacts:reducerState.friends
    })
}

export default connect(mapStateToProps,{updateUser, FriendUpdate})(Profile)