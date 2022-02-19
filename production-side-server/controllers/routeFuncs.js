const queryFuncs = require("../db/queryFunc");
const systemFuncs = require("../modules/systemFuncs");
const {generateRandomBytes} = require("../../Client-server/utils/randomBytes");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");


const genrateSaltAndIt = async function (req, res) {

  try {
    let uName = req.params.username;
    //function to filter out login_hash of that username and return a object having hash_value;
    let data = await queryFuncs.userDetailData(uName);
    const hashString = data[0].login_hash;

    //function to seprate out salt and no of it from hash and return a object named obj which contain salt and no of it.
    const obj = await systemFuncs.saltAndIt(hashString);
    return res.status(200).json(obj);
  } catch (error) {
    return res.status(200).json({
        success: false,
        message: "Something went wrong. please try again.",
      });
  }
};

async function createAccount(req, res) {
  try {
    let data = {
      username: req.body.username,
      login_hash: req.body.password,
      email: req.body.email,
      mobileNo: req.body.mobileNo
    }
    //fun to hash the hashed value again;
    const saltBuffer = await generateRandomBytes(32);
    const salt = saltBuffer.toString("hex");
    data.login_hash = await systemFuncs.hashAgain(data.login_hash, salt);

    // fun to store data.
    let result = await queryFuncs.InsertIntoUserDetail(data);
    if(result)
      return res.status(201).json({
        success: result,
        message: `${data.username} your account is created.`,
      });
    
  } catch (error) {
    return res.status(404).json({ error });
  }
}

async function sendLoginData(req, res) {
  try {
    //fun to send a json file contains whole data of user.
    const uName = req.params.username;
    const data = await queryFuncs.userDetailData(uName);
    const userId = data[0].u_id;


    const loginData = await queryFuncs.userLoginData(userId);
    return res.json(loginData);
  } catch (error) {
    return res.json({ error: `${error}` });
  }
}

async function saveUserData(req, res) {
  try {
    const loginData = req.body;
    const uName = req.params.username;
    let data = await queryFuncs.userDetailData(uName);
    const userId = data[0].u_id;
    //fun to store data
    const result = await queryFuncs.insertIntoLoginDetail(loginData, userId);
    return res.json({
      success: `${result}`,
      message: "successfully inserted...",
    });
  } catch (error) {
    return res.json({ error: `${error}` });
  }
}

async function login(req, res) {
  /*
      req body will contain a object having login_hash and username for verification.
      then function "verifyPass" return ture or false accordinly.
   */
  try {
    const obj = req.body;
    const result = await systemFuncs.verifyPassword(obj);
    if (result) {
      //signing JWT-token.
      const token = jwt.sign({
        username : obj.username
      } , process.env.secret_key ,{
        expiresIn :"1h"
      });
      console.log(token);
      return res.status(200).json({
        success: true,
        msg: "Login Successful",
        token
      });
    } else {
      return res.json({
        success: false,
        message: "invalid password or username.",
      });
    }
  } catch (error) {
    return res.json({ error });
  }
}


async function updateUserData(req, res) {
  try {
    const username = req.params.username;
    const id = req.params.id;
    const newData = req.body;
    let data = await queryFuncs.userDetailData(username);
    const userId = data[0].u_id;
    let uId = await queryFuncs.userIdFromLoginDetail(id);
    uId = uId[0].u_id;
    if (uId === userId) {
      const result = await queryFuncs.updateUserData(id, newData);
      return res.json({
        success: `${result}`,
        message: "data is successfully updated.",
      });
    } else {
      return res.json({
        success: false,
        message: "id does not match with username",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Something went wrong. please try again.",
    });
  }
}
async function deleteData(req, res) {
  try {
    const username = req.params.username;
    const id = req.params.id;
    let data = await queryFuncs.userDetailData(username);
    const userId = data[0].u_id;
    let uId = await queryFuncs.userIdFromLoginDetail(id);
    uId = uId[0].u_id;
    if (uId === userId) {
      const result = await queryFuncs.deleteRowInLoginDetail(id);
      return res.json({
        success: `${result}`,
        message: "data is successfully deleted.",
      });
    } else {
      return res.json({
        success: false,
        message: "id does not match with username",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Something went wrong. please try again.",
    });
  }
}



async function verifyToken(req, res , next){
  const token = req.header("authToken");

  if(!token) res.status(200).json({success : false , mssg : "Access denied."});
  
  try {
    const isVerified = jwt.verify(token , process.env.secret_key);
    // if token is correct then "isVerified" contaions the payload passed while signing jwt.
    req.username = isVerified.username;

    next();
  } catch (error) {
    console.log(error);
  }

}

module.exports = {
  genrateSaltAndIt,
  createAccount,
  sendLoginData,
  saveUserData,
  login,
  updateUserData,
  deleteData,
  verifyToken
};
