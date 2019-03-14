import React, { Component } from "react"
import "./RegisterForm.css"
import axios from "axios"
import { updateUser } from "../../Redux/reducer"
import { connect } from "react-redux"
import  { Redirect } from "react-router-dom"
import message from "./message.png"
import addFriend from "./addFriend.png"
import share from "./share.png"

export class RegisterForm extends Component{
    constructor(){
        super()
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            profile_picture:"",
            department:"",
            redirect:false,
            //Login state
            logEmail:"",
            logPassword:"",
            errorMsg:""
        }
        this.login = this.login.bind(this)
    }

    login(){
        const { logEmail, logPassword} = this.state
        let body = {
            logEmail,
            logPassword
        }
        axios.post("/login", body).then(response =>{
            console.log(response.data)
            this.props.updateUser(response.data)
            this.setState({redirect:true})
        }).catch(error =>{error.status = "403"? this.setState({errorMsg:"Incorrect username or password"}) : null})
    }

    register = () =>{
        const {first_name, last_name,profile_picture,department,password,email} = this.state
        let body = {
            first_name,
            last_name,
            status:"",
            profile_picture: this.state.profile_picture == ""? "https://prd-wret.s3-us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/placeholder-profile_2_0.png":this.state.profile_picture,
            department,
            password,
            email
        }

        axios.post("/register", body).then(response =>{
            this.props.updateUser(response.data)
            this.setState({redirect:true})
        })
    }

    render(){
        const redirect = <Redirect to = "/dashboard" />
        
        return(
            <div className = "register-box">
                
                
                <div className = "About-icons">
                <h2 className = "header-text">Get connected, stay connected.</h2>

                <div className = "message-icon">
                    <img src = {message}></img>
                    <p>Got something to say? Say it through connect with private messaging to anyone.</p>
                </div>
                
                <div className = "person-icon">
                    <img src = {addFriend}></img>
                    <p>Connect with people you know, and meet people you don't!</p>
                </div>

                <div className = "share-icon">
                    <img src = {share}></img>
                    <p>Your life, displayed for the world. Share the important parts of life to those who matter most</p>
                </div>
            
                </div>

                <div className = "line"></div>

                <div className = "choose-box">
                    <div className = "login-box">
                            <h2>Log in</h2>
                            <input className = "email-input" placeholder = "Enter email..." onChange = {(e) =>{this.setState({logEmail:e.target.value})}}></input>
                            <input className = "password-input" type = "password" placeholder = "Enter password..." onChange = {(e) =>{this.setState({logPassword:e.target.value})}}></input>
                            { this.state.errorMsg? <p className = "name">{this.state.errorMsg}</p> : null }
                            <button className = "login" onClick = {this.login}>Login</button>
                    </div>

                    <div className = "orLine">
                        <div className = "circle">
                            <p>Or</p>
                        </div>
                    </div>

                    <h4 className = "register-text">Register</h4>
                    <div className = "register-body">
                        <div className = "name-holder">
                            <input placeholder = "Enter First name" onChange = {(e) =>{this.setState({first_name:e.target.value})}}></input>
                            <input placeholder = "Enter Last name" onChange = {(e) =>{this.setState({last_name:e.target.value})}}></input>
                            <input className = "email-input" placeholder = "Enter email..." onChange = {(e) =>{this.setState({email:e.target.value})}}></input>
                            <input className = "password-input" type = "password" placeholder = "Enter password..." onChange = {(e) =>{this.setState({password:e.target.value})}}></input>
                        </div>

                        <div className = "image-holder">
                            <input placeholder = "Input image url here! " onChange = {(e) =>{this.setState({profile_picture:e.target.value})}}></input>
                            <div className = "picture-frame"><img className = "profile-picture" src = {this.state.profile_picture? this.state.profile_picture: null}></img></div>
                            <button className = "register-button" onClick = {this.register}>Register</button>
                        </div>
                            
                        
                    </div>
                    

                </div>
                
                {this.state.redirect? redirect:null}
            </div>
        )
    }
}

export default connect(null, {updateUser})(RegisterForm)

{/* <div className = "login-box">
                        <h1>Got an account? Log in!</h1>
                        <input className = "email-input" placeholder = "Enter email..." onChange = {(e) =>{this.setState({logEmail:e.target.value})}}></input>
                        <input className = "password-input" type = "password" placeholder = "Enter password..." onChange = {(e) =>{this.setState({logPassword:e.target.value})}}></input>
                        { this.state.errorMsg? <p>{this.state.errorMsg}</p> : null }
                        <button onClick = {this.login}>Login</button>
                    </div>

                    <div className = "orLine">
                        <div className = "circle">
                            <p>Or</p>
                        </div>
                    </div>

                    <div className = "register">
                        <div>
                            <h1>Register!</h1>
                        </div>

                        <div className = "register-body">
                        
                            <h4>First things first, tell us a little about yourself.</h4>
                            <h4>Name:</h4>
                            <input placeholder = "Enter First name" onChange = {(e) =>{this.setState({first_name:e.target.value})}}></input>
                            <input placeholder = "Enter Last name" onChange = {(e) =>{this.setState({last_name:e.target.value})}}></input>
                            <h4>Email:</h4>
                            <input className = "email-input" placeholder = "Enter email..." onChange = {(e) =>{this.setState({email:e.target.value})}}></input>
                            <h4>Password:</h4>
                            <input className = "password-input" type = "password" placeholder = "Enter password..." onChange = {(e) =>{this.setState({password:e.target.value})}}></input>
                            <h4>Upload a profile picture!</h4><input placeholder = "Input image url here! " onChange = {(e) =>{this.setState({profile_picture:e.target.value})}}></input>

                            <h4>Select your department:</h4>
                            <select value={this.state.department}>
                                <option>Engineering</option>
                                <option>Management</option>
                                <option>Buisness</option>
                                <option>Marketing</option>
                                <option>Sales</option>
                            </select>

                            <button onClick = {this.register}>Register</button>
                        
                        </div>

                    </div> */}