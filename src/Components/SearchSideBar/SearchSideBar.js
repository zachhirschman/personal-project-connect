import React, { Component } from "react"
import "./SearchSideBar.css"
import Contact from "../Contact/Contact";
import { connect } from "react-redux"
import { updateUsersConnected } from "../../Redux/reducer"
import refresh from "./2849811-24.png"
import Axios from "axios";


export class SearchSideBar extends Component{
    constructor(props){
        super(props)
        this.state = {
            toggleSearch:false,
            usersConnected:[],
            currentUser:""
        }
        
        console.log("User that we are sending to be put into connectedUsers: ", this.props.user)
        //Wait till we recieve redux state, and then send it to be put into usersConnected
        setTimeout(() =>{this.props.socket.emit("NewUser", this.props.user)}, 200)
        
        //Wait same amount of time to recieve the users, so I wont get it too early
        
            props.socket.on("UserEnter", data =>{
                console.log("Users from server to update redux and local usersConnected: ", data)
                this.props.updateUsersConnected(data) // am i even using this redux state anywhere
                this.setState({
                    usersConnected:data
                })
            })

    }

    componentDidUpdate = (prevProps) =>{
        if(this.props.usersConnected.email != prevProps.usersConnected.email){
            this.props.socket.on("UserEnter", data =>{
                console.log("Users from server to update redux and local usersConnected: ", data)
                this.props.updateUsersConnected(data) // am i even using this redux state anywhere
                this.setState({
                    usersConnected:data
                })
            })
        }
        // console.log(prevProps)
    }
    getMutualFriends = () =>{
        setTimeout(() =>{
            if(this.props.connectionInformation.recipient){
                let senderID = this.props.connectionInformation.sender.user_id
                let recipientID = this.props.connectionInformation.recipient.user_id

                Axios.get(`/GetMutualFriends/${senderID}/${recipientID}`).then(response =>{
                    console.log("Got mutual friends,", response.data)
                    let filteredMutualFriends = response.data.filter(e =>{
                        return e.connection_id != e.connection_id
                    })
                    console.log("Filtered friends: ", filteredMutualFriends)
                })
            }
        },200)

    }
    

    render(){
        const {usersConnected} = this.state //was state
        const { socket } = this.props
        
        const searchBar = (
            <div className = "search-parent">

            <div className = "container-header">
                    <h3 className = "title">Who's Online?</h3>
                    <button className = "refresh"><img src={refresh}></img></button>
                </div>

                <div>
                {
                    usersConnected.length? usersConnected.map(user =>{
                        return(
                            <div className = "contacts">
                                <Contact first = {user.first_name}
                                         last = {user.last_name}
                                         image = {user.profile_picture}
                                         status = {user.status}
                                         dept = {user.department}
                                         user_id = {user.user_id}
                                         socket = {socket}
                                         getMutualfn = {this.getMutualFriends}/>
                            </div>
                        )
                    })
                    :
                    null
                    
                }
                </div>
            </div>
        )
        return(
            <div className = {this.props.toggleSearchBar? "search-Grandparent":"search-Grandparent-supreme"}>
            {this.props.toggleSearchBar? null : <div className = "container-header"><h3 className = "title">Common connections with {this.props.connectionInformation.recipient ? this.props.connectionInformation.recipient.first : null}</h3></div>}
                {this.props.toggleSearchBar? searchBar : null}

            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        user:state.user,
        usersConnected:state.usersConnected,
        toggleSearchBar:state.toggleSearchBar,
        connectionInformation:state.connectionInformation
    }
}

export default connect(mapStateToProps,{updateUsersConnected})(SearchSideBar)
