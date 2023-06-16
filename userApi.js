const exp=require("express");
const userapp=exp.Router()
const bcrypt=require("bcryptjs")
const asynchandler = require("express-async-handler")
//body parser
userapp.use(exp.json())


//to show users
userapp.get('/users',asynchandler(async(request,response)=>{
    const stuCollection=request.app.get("stuCollection");

    let userList = await stuCollection.find().toArray()
    
    response.send(userList)

}))


//tofind users
userapp.get('/get-user/:id',asynchandler(async(request,response)=>{
    const stuCollection=request.app.get("stuCollection");
    let userId=(+request.params.id)
    let found = await stuCollection.findOne({id:userId})
    
    if(found==='null')
    response.send("NOt found")
    else
    response.send(found) 
}))


//to create new users
userapp.post('/create-user',async(request,response)=>{
   //get stuCollection
   const stuCollection=request.app.get("stuCollection");

   //get newUser from request
   const newUser=request.body;

   //need to check if he is already existed or not
   let x = await stuCollection.findOne({name:newUser.name})
   if(x!=null)
   {
        response.send("username already existed")
   }
   else
   {
        console.log(newUser.password);
        const pass = await  bcrypt.hash(newUser.password,5);
        console.log(pass);
        newUser.password=pass;
   //insert
        await stuCollection.insertOne(newUser)
   }
   
   
})


//to update users
userapp.put('/update-user',async(request,response)=>{
    const stuCollection=request.app.get("stuCollection");

    let updateUser=request.body;

    let update = await stuCollection.updateOne({id:updateUser.id},{$set:{...updateUser}})
    response.send(update)
    
})


//todelete users
userapp.delete('/delete-user/:id',async(request,response)=>{
    const stuCollection=request.app.get("stuCollection");

    let userId=+request.params.id

    let del = await stuCollection.deleteOne({id:userId})
    
    response.send(del)
    
})

module.exports=userapp;
