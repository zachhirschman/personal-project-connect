let initialState = {
    user:[],
    usersConnected:[],
    toggleSearchBar:true,
    toggleVideo:false,
    connectionInformation:[],
    chatHistory:{},
    friends:[],
    socket:[]
}

const UserData = "UserData"
const usersConnected = "usersConnected"
const updateToggle = "updateToggle"
const updateVideoToggle = "updateVideoToggle"
const connectionInformation2 = "connectionInformation"
const getChatHistory = "getChatHistory"
const updateFriends = "updateFriends"
const socketUpdate = "socketUpdate"

export function reducer(state = initialState, action){
    switch(action.type){
        case UserData:
            return {...state, user:action.payload}
        case usersConnected:
            return {...state, usersConnected:action.payload}
        case updateToggle:
            return {...state, toggleSearchBar:action.payload}
        case updateVideoToggle:
            return {...state, toggleVideo:action.payload}
        case connectionInformation2:
            return{...state, connectionInformation:action.payload}
        case getChatHistory:
            return {...state, chatHistory:action.payload}
        case updateFriends:
            return {...state, friends:action.payload}
        case socketUpdate:
            return {...state, socket:action.payload}
        default:
            return state
    }
}
export function updateSocket(socket1){
    console.log("Got socket!", socket1)
    return{
        type:socketUpdate,
        payload:socket1
    }
}
export function FriendUpdate(newFriend){
    return{
        type:updateFriends,
        payload:newFriend
    }
}

export function updateUser(userInformation){
    console.log(userInformation)
    return{
        type:UserData,
        payload:userInformation
    }
}
export function updateUsersConnected(user){
    return{
        type:usersConnected,
        payload:user
    }
}
export function updateToggleSearchBar(bool){
    return{
        type:updateToggle,
        payload:bool
    }
}
export function updateVideo(bool){
    return{
        type:updateVideoToggle,
        payload:bool
    }
}

export function updateConnectionInformation(connectionInformation){
    return{
        type:connectionInformation2,
        payload:connectionInformation
    }
}
export function updateChatHistory (chatHistory){
    console.log(chatHistory)
    return{
        type:getChatHistory,
        payload:chatHistory
    }
} 

