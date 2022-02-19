// modules required
const express = require("express");
const postroute = require("../routes/routes");
const queryFuncs = require("../db/queryFunc");
const path = require('path');
const fs = require('fs');
const https = require("https");


//creating a server
const app = express();


//middleware
//Only if user got authenticated.
app.use('/userdata', postroute);
app.use('/userdata', (req,res)=>res.send("hlw from https server"));


//listening to the server.
const port = process.env.PORT || 8080;

const secureServer = https.createServer({
    key : fs.readFileSync(path.join(__dirname ,'..', 'TLS' , 'private.pem')),
    cert : fs.readFileSync(path.join(__dirname ,'..', 'TLS' , 'cert.pem'))
},app);


secureServer.listen(port, ()=>{
    console.log(`Server is running on port : ${port}`);
    
});






// queryFuncs.deleteTable(t_name);





