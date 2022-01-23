// modules required
const express = require("express");
const postroute = require("../routes/routes");
const queryFuncs = require("../db/queryFunc");


//creating a server
const app = express();


//middleware
//Only if user got authenticated.
app.use('/userdata', postroute);


//listening to the server.
const port = process.env.PORT || 8080;


app.listen(port, ()=>{
    console.log(`Server is running on port : ${port}`);
});






// queryFuncs.deleteTable(t_name);





