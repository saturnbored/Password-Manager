const queryFuncs = require("../db/queryFunc");
const { verifyPassword } = require("../../Client-server/crypto/Passwords");
const systemFuncs = require("../modules/systemFuncs");
const {
  generateRandomBytes,
} = require("../../Client-server/utils/randomBytes");

const genrateSaltAndIt = async function (req, res) {
  try {
    let uName = req.params.username;
    //function to filter out login_hash of that username and return a object having hash_value;
    let data = await queryFuncs.userDetailData(uName);
    const hash_string = data[0].login_hash;

    //function to seprate out salt and no of it from hash and return a object named obj which contain salt and no of it.
    const obj = await systemFuncs.saltAndIt(hash_string);
    return res.status(200).json(obj);
  } catch (error) {
    return res.json({
        success: false,
        message: "Something went wrong. please try again.",
      });
  }
};

async function createAccount(req, res) {
  try {
    let data = req.body;
    //fun to hash the hashed value again;
    const saltBuffer = await generateRandomBytes(32);
    const salt = saltBuffer.toString("hex");
    data.login_hash = await systemFuncs.hashAgain(data.login_hash, salt);

    // fun to store data.
    let result = await queryFuncs.insertIntoLoginDetail(data);
    let uName = dataObject.username;
    return res.json({
      sucess: result,
      message: `${uName} your account is created.`,
    });
  } catch (error) {
    return res.status(404).json({ error: `${error}` });
  }
}

async function sendLoginData(req, res) {
  try {
    //fun to send a json file contains whole data of user.
    const uName = req.params.username;
    const data = await queryFuncs.userDetailData(uName);
    const userId = data[0].u_id;
    console.log(userId);
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
    const result = await verifyPassword(obj);
    if (result) {
      //genrate jwt.
      jwt.sign();
    } else {
      return res.json({
        success: false,
        message: "invalid password or username.",
      });
    }
  } catch (error) {
    return res.json({ error: `${error}` });
  }
}

async function updateUserData(req, res) {
  try {
    const username = req.params.username;
    const id = req.params.id;
    const newData = req.body;
    let data = await queryFuncs.userDetailData(username);
    const userId = data[0].u_id;
    const uId = await queryFuncs.userIdFromLoginDetail(id);
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
    const uId = await queryFuncs.userIdFromLoginDetail(id);
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

module.exports = {
  genrateSaltAndIt,
  createAccount,
  sendLoginData,
  saveUserData,
  login,
  updateUserData,
  deleteData,
};
