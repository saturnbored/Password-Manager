// modules required
const express = require("express");
const path = require("path");
const postroute = require("../routes/routes");
const queryFuncs = require("../db/queryFunc");
// const sqlite3 = require("sqlite3");


//creating a server
const app = express();


//middleware
//Only if user got authenticated.
app.use('/userdata', postroute);
// app.use('/logindata', loginroute);

//listening to the server.
const port = process.env.PORT || 8080;


app.listen(port, ()=>{
    console.log(`Server is running on port : ${port}`);
});





// const t_name = "user_profile";
const t_name = "lakshA_detail";

// queryFuncs.createTable_login();
// queryFuncs.deleteTable(t_name);
// // queryFuncs.createTable_login();


// db.run('DROP TABLE user_profile');

// module.exports = db;


