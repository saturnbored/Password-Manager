const express = require("express");
const routeFuncs = require("../controllers/routeFuncs");

const router = express.Router();

//So that express accept json in body
router.use(express.json());


// post req when user creates a new acc.
//completed.
router.post("/create/account", routeFuncs.createAccount);


//get req for sending salt and no of iteration.
router.get("/salt/:username/", routeFuncs.genrateSaltAndIt );


//post req to validate user cendentials.
router.post("/login", routeFuncs.login );


// queryFuncs.createTable_user_profile()



//get req to send whole login_details of user.
router.get("/vault/:username",routeFuncs.verifyToken, routeFuncs.sendLoginData);

//post req when Existing User storing the password.
router.post("/savepassword/:username",routeFuncs.verifyToken, routeFuncs.saveUserData );


//route to update user vault.
router.patch("/data/:username/:id",routeFuncs.verifyToken, routeFuncs.updateUserData );

//route to delete data from login_detail.
router.delete("/data/:username/:id" ,routeFuncs.verifyToken, routeFuncs.deleteData);



module.exports = router;

