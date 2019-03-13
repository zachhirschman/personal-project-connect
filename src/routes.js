import React, { Component } from "react"
import {Route, Switch} from "react-router-dom"
import Home from "./Components/Home/Home";
import Dashboard from "./Components/Dashboard/Dashboard";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import { VideoChatHolder } from "./Components/VideoChatHolder/VideoChatHolder";



export default(
    <Switch>
        <Route exact path = "/" component = { Home }/>
        <Route path = "/dashboard" component = { Dashboard }/>
        <Route path = "/login" component = { RegisterForm }/>
        <Route path = "/VideoCall" component = { VideoChatHolder }/>
    </Switch>
)