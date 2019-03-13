import React, {Component} from "react"
import DropZone from "react-dropzone"

const FileUpload = ({children}) =>(
    <DropZone onDrop ={() =>{console.log("File Dropped!")}}>
        {children}
    </DropZone>
)
export default FileUpload