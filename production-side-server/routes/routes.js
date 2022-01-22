const express = require("express");
const { verifyPassword } = require("../../Client-server/crypto/Passwords");
const queryFuncs = require("../db/queryFunc");
const systemFuncs = require("../modules/systemFuncs");
const router = express.Router();

//get req for sending salt and no of iteration.
//Completed.
router.get("/salt/:username", async (req, res) => {
  let uName = req.params.username;
  //function to filter out login_hash of that username and return a object having hash_value;
  let data = await queryFuncs.user_detail_data(uName);
  const hash_string = data[0].login_hash;

  //function to seprate out salt and no of it from hash and return a object named obj which contain salt and no of it.
  const obj = await systemFuncs.salt_it(hash_string);
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
    data.login_hash = await systemFuncs.hashAgain(data.login_hash);

    // fun to store data.
    let result = await queryFuncs.insert_into_user_detail(data);
    let uName = dataObject.username;
    res.json({
      sucess: result,
      message: `${uName} your account is created.`,
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

// queryFuncs.createTable_user_profile()

//post req to validate user cendentials.
router.post("/login", async (req, res) => {
  /*
    req body will contain a object having login_hash and username for letification.
    then function "verifyPass" return ture or false accordinly.
 */
  const obj = req.body;

  await verifyPassword();
});

//get req to send whole login_details of user.
router.get("/sendData/:username", async (req, res) => {
  //fun to send a json file contains whole data of user.
  const uName = req.params.username;
  const data = await queryFuncs.userDetailData(uName);
  const userId = data[0].u_id;
  console.log(userId);
  const loginData = await queryFuncs.loginDetailData(userId);

  res.json(loginData);
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
    res.json({ error: error });
  }
});

module.exports = router;
