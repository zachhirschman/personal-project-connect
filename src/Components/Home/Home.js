import React, {Component} from "react"
import "./Home.css"
import {  Link } from "react-router-dom"

export default class Home extends Component{
    constructor(){
        super()
        this.state={

        }
    }
    render(){
        return(

        <div className = "Homebody">
            <div className = "FormHolder">
                    <h6 className = "Title">Start being more productive. Connect</h6>
                <div className = "Buttons">
                    <Link to = "/login"><button className = "getStarted">Get Started</button></Link>
                </div>

            </div>
        </div>

        )
    }
}