module.exports ={
    create:(req,res) =>{
        const { db } =req.app.get("db")
        const {first_name, last_name,status,profile_picture,department,messages} = req.body
        db.create_user([first_name, last_name,status,profile_picture,department,messages]).then(response =>{
            res.status(200).json(response)
        })
    }
}