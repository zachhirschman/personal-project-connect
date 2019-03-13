import React, { Component, useCallback } from "react"
import axios from "axios";
import "./CommunityPosts.css"
import uploadImg from "./uploadImage.png"
import {connect} from "react-redux"
import {useDropzone} from 'react-dropzone'
import FileUpload from "../DropZone/FileUpload"
import Like from "./Like.png"
import { AssertionError } from "assert";



export default class CommunityPosts extends Component{
    constructor(props){
        super(props)
        this.state = {
            posts:[],
            allComments:[],
            likes:[],
            post_text:'',
            user_comment:"",
            toggleDrop:false,
            toggleClick:false
        }
        props.socket.on("NewPostToShow", newPosts =>{
            // console.log("After emmiting all posts to all users: ", newPosts)
            this.setState({posts:newPosts})
        })
        props.socket.on("NewCommentToShow", newComments =>{
            // console.log("After emmiting all comments to all users: ", newComments)
            this.setState({allComments:newComments})
        })
        props.socket.on("newLike", newLikes =>{
            this.setState({posts:newLikes})
            console.log("new likes.", newLikes)
        })
        // props.socket.on("updateLikes", likes =>{
        //     this.setState
        // })
    }
    componentDidMount = () =>{
        axios.get("/GetPosts").then(response =>{
            // console.log("Response after getting posts: ", response.data)
            this.setState({
                posts:response.data
            })
        })
        //Get comments. Does the comment_id match the post_id? join that comment to that post
        console.log("About to send request for comments")
        axios.get("/GetComments").then(response =>{
            console.log("Response after getting comments: ", response.data)
            this.setState({
                allComments:response.data
            })
        })
    }
    makeNewPost = () =>{
        let body = {
            first_name:this.props.currentUser.first_name,
            last_name:this.props.currentUser.last_name,
            profile_picture:this.props.currentUser.profile_picture,
            post_text:this.state.post_text,
            post_image:""
        }
        this.props.socket.emit("newPost",body)
        this.props.toggleNewPostFn()
        
    }
    addComment = (post_id,event) =>{
        var code = event.keyCode || event.which;
        let body = {
            post_comment:this.state.user_comment,
            post_id:post_id,
            poster_first_name:this.props.currentUser.first_name,
            poster_last_name:this.props.currentUser.last_name,
            poster_picture:this.props.currentUser.profile_picture
        }
        if(code === 13) { 
            this.props.socket.emit("newComment", body)
        } 
    }
    addLike = (post_id) =>{
        let body = {
            post_id:post_id,
            Liker_first:this.props.currentUser.first_name
        }
        this.props.socket.emit("Like", body)
        this.toggleClick()
    }
    handleChange = () =>{
        this.setState({toggleDrop:!this.state.toggleDrop})
    }
    toggleClick = () =>{
        this.setState({toggleClick:!this.state.toggleClick})
    }
    render(){
        
        const {newPost} = this.props

        

        const postForm = (
            <div className = {newPost? "Show-NewPost":"Hide-NewPost"}>
                <div className = "container-Header">New Post</div>
                <div className = "New-Post-content">
                    <input className = "New-post-input" placeholder = "What's on your mind?" onChange = {(e) =>{this.setState({post_text:e.target.value})}}></input>
                    <div className = "divider"></div>
                    {this.state.toggleDrop? <div className= "Image-uploader"> Upload an image !</div> :null}
                    <div className = "Lower-container">
                        <div className = "Button-holder">
                            <button className = "AddImage" onClick = {this.handleChange}><img src = {uploadImg}></img>Add an Image!</button>
                        </div>
                        <button className = "Button-holder" onClick = {this.makeNewPost}>
                            Share
                        </button>
                    </div>
                </div>
            </div>
        )
        
        let mappedPosts = this.state.posts.map(post =>{
            let mappedComments = this.state.allComments.map(comment =>{
                    if(comment.post_id == post.post_id){
                        return(
                            <div className = "Comment-container">
                                <div className = "commenter-information">
                                    <img className = "comment-pic" src = {comment.poster_picture}></img>
                                    <p className = "name">{comment.poster_first_name + " " + comment.poster_last_name}</p>
                                </div>
                                    <div className = "comment-content">
                                        <p>{comment.post_comment}</p>
                                    </div>
                            </div>
                        )
                        
                    }
            })
            let mappedLikes = this.state.posts.map(post =>{
                return post.like_count
            })

            

            return(

                <div className = "post">
                    <div className = "post-header"><img className = "profile-pic" src = {post.poster_picture}></img><p>{post.poster_first_name} shared a post</p></div>
                        <div className = "post-content">
                            <div className = "textholder">
                                <p>{post.post_text}</p>
                            </div>
                            
                            <div className = "content-divider"></div>

                                <div className = 'LikeBar'>
                                    <button className = "like"  onClick ={() =>{this.addLike(post.post_id)}}><img src = {Like}></img></button>{post.like_count === 1? <p className = "name">{post.like_count} person likes this</p> : <p className = "name">{post.like_count} people like this</p>}
                                </div>

                            <div className = "footer-container">
                                <div className = "comment-parent">
                                    {mappedComments}
                                </div>
                                <div className = "comment-bar">
                                    <img className = "profile-pic" src = {this.props.currentUser.profile_picture}></img>
                                    <input onChange = {(e) =>{this.setState({user_comment:e.target.value})}} onKeyPress = {(e) => this.addComment(post.post_id,e)} placeholder = "Add a comment..."></input>
                                </div>
                            </div>
        
                        </div>
                        
                </div>

            )
        })

        return(
            <div className ="Outermostbody">
            {/* <div className = "formHolder"> */}
                {/* {postFrom} */}
                {postForm}
            {/* </div> */}
            {/* <div className = "all-posts"> */}
                {mappedPosts}
            {/* </div>  */}
            </div>
        )
    }
}
// let mapStateToProps = (state) =>{
//     return{
//         user:state.user
//     }
// }
// export default connect(mapStateToProps, null)(CommunityPosts)