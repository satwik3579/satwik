const exp=require("express");
const app=exp();
app.listen(3500,()=>{})


//get mongoclient
const mclient=require('mongodb').MongoClient;

//connect to DB server using mongo client
mclient.connect('mongodb://localhost:27017')
.then(dbRef=>{
    
    //connect to a database
    const dbObj=dbRef.db('vnruserdb')
    //connect to collections of database
    const stuCollection=dbObj.collection("stuCollection");
    const tutCollection=dbObj.collection("tutCollection");
    //share collections to APIS
    app.set("stuCollection",stuCollection);
    console.log("DB connection success");

})
.catch(err=>console.log("db connection error",err));



const userApp=require("./apis/userApi");

app.use('/user-api',userApp);



//invalid path(to handle invalid path)
const invalidPath=(request,response,next)=>{
    response.send({message:'invalid path'});
}
app.use("*",invalidPath);


//error habdiling middleware (should be atlast)
const errorHandiling=(error,request,response,next)=>{
    response.send({message:error.message});
}
app.use(errorHandiling)