import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import routes from "./routes"
import {connect} from "react-redux"
import { updateVideo } from "./Redux/reducer"
import cancelVideo from "./CancelVideo.png"




class App extends Component {
  constructor(){
    super()
  }
  // toggleVideo = () =>{
  //   this.props.updateVideo(!this.props.toggleVideo)
  // }
  render() {
    return (
      <div className="App">
        <Header/>
        {routes}
      </div>
    );
  }
}
// const mapStateToProps = (state) =>{
//   return{
//     toggleVideo:state.toggleVideo
//   }
// }

export default App
