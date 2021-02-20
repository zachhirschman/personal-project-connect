import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import RegisterForm from './Components/RegisterForm/RegisterForm'
import Dashboard from './Components/Dashboard/Dashboard'
import socketIOClient from 'socket.io-client';
import {Route, Switch} from "react-router-dom"


const socket = socketIOClient();

class App extends Component {
  constructor(){
    super()
  }
  render() {
    return (
      <div className="App">
        <Header socket={socket}/>
        <Switch>
          <Route exact path = "/" render = {(props) => (<RegisterForm {...props} />)}/>
          <Route path = "/dashboard" render = {(props) => (<Dashboard {...props} socket={socket}/>) } />
        </Switch>
      </div>
    );
  }
}

export default App
