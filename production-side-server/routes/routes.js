const express = require("express");
const { verifyPassword } = require("../../Client-server/crypto/Passwords");
const queryFuncs = require("../db/queryFunc");
const systemFuncs = require("../modules/systemFuncs");
const router = express.Router();
const {
  generateRandomBytes,
} = require("../../Client-server/utils/randomBytes");

//get req for sending salt and no of iteration.
//Completed.
router.get("/salt/:username", async (req, res) => {
  let uName = req.params.username;
  //function to filter out login_hash of that username and return a object having hash_value;
  let data = await queryFuncs.userDetailData(uName);
  const hash_string = data[0].login_hash;

  //function to seprate out salt and no of it from hash and return a object named obj which contain salt and no of it.
  const obj = await systemFuncs.saltAndIt(hash_string);
  res.status(200).json(obj);
});

//So that express accept json in body
router.use(express.json());

// post req when user creates a new acc.
//completed.
router.post("/create/account", async (req, res) => {
  try {
    let data = req.body;
    //fun to hash the hashed value again;
    const saltBuffer = await generateRandomBytes(32);
    const salt = saltBuffer.toString("hex");
    data.login_hash = await systemFuncs.hashAgain(data.login_hash, salt);

    // fun to store data.
    let result = await queryFuncs.insertIntoLoginDetail(data);
    let uName = dataObject.username;
    res.json({
      sucess: result,
      message: `${uName} your account is created.`,
    });
  } catch (error) {
    res.status(404).json({ error: `${error}` });
  }
});

// queryFuncs.createTable_user_profile()

//get req to send whole login_details of user.
router.get("/sendData/:username", async (req, res) => {
  try {
    //fun to send a json file contains whole data of user.
    const uName = req.params.username;
    const data = await queryFuncs.userDetailData(uName);
    const userId = data[0].u_id;
    console.log(userId);
    const loginData = await queryFuncs.userLoginData(userId);
    res.json(loginData);
  } catch (error) {
    res.json({ error: `${error}` });
  }
});

//post req when Existing User storing the password.
router.post("/savepassword/:username", async (req, res) => {
  try {
    const loginData = req.body;
    const uName = req.params.username;
    let data = await queryFuncs.userDetailData(uName);
    const userId = data[0].u_id;
    //fun to store data
    const result = await queryFuncs.insertIntoLoginDetail(loginData, userId);
    res.json({ success: `${result}`, message: "successfully inserted..." });
  } catch (error) {
    res.json({ error: `${error}` });
  }
});

//post req to validate user cendentials.
router.post("/login", async (req, res) => {
  /*
    req body will contain a object having login_hash and username for verification.
    then function "verifyPass" return ture or false accordinly.
 */
  try {
    const obj = req.body;
    const result = await verifyPassword(obj);
    if (result) {
      //genrate jwt.
    } else {
      res.json({ success: false, message: "invalid password or username." });
    }
  } catch (error) {
    res.json({ error: `${error}` });
  }
});

//route to update user vault.
router.patch("data/:username/:id", async (req, res) => {
  try {
    const username = req.params.username;
    const id = req.params.id;
    const newData = req.body;
    let data = await queryFuncs.userDetailData(username);
    const userId = data[0].u_id;
    const uId = await queryFuncs.userIdFromLoginDetail(id);
    if (uId === userId) {
      const result = await queryFuncs.updateUserData(id, newData);
      res.json({
        success: `${result}`,
        message: "data is successfully updated.",
      });
    } else {
      res.json({ success: false, message: "id does not match with username" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong. please try again.",
    });
  }
});

module.exports = router;
