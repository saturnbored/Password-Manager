const express = require("express");
const queryFuncs = require("../db/queryFunc");
const systemFuncs = require("../modules/systemFuncs");
const router = express.Router();





//get req for sending salt and no of iteration.
router.get("/salt/:username" ,async (req,res)=>{

    //function to filter out login_hash of that username and return a object having hash_value;
    var data =  await queryFuncs.user_detail_data(req, res);
    const hash_string = data[0].login_hash;
    
    //function to seprate out salt and no of it from hash and return a object named obj which contain salt and no of it.
    const obj = await systemFuncs.salt_it(hash_string);
    res.status(200).json(obj);
});



//So that express accept json in body
router.use(express.json());


// post req when user creates a new acc.
router.post("/create/account",async(req,res)=>{
    // var {data} = req.body;
    //fun to hash the hashed value again;

    
    // fun to store data.
    var data = await queryFuncs.insert_into_user_detail(req,res);
    let u_name = data.username;
    console.log(`${u_name} your account is created.`);
    let mssg = await queryFuncs.createTable_login(u_name);
    console.log(mssg);
    
});

// queryFuncs.createTable_user_profile()




//post req when ExistingUser storing the password.
router.post("/savepassword/:username",(req,res)=>{
    const u_name = req.params.username;

    //fun to store data
    queryFuncs.insert_into_login(u_name, req , res);
});



//get req to send whole login_details of user.
router.get("/sendData/:username",(req,res)=>{
    //fun to send a json file contains whole data of user.
    const u_name = req.params.username;
    queryFuncs.login_detail_data(u_name, res);
});




module.exports = router;
