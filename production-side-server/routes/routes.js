const express = require("express");
const routeFuncs = require("../controllers/routeFuncs");

const router = express.Router();

//get req for sending salt and no of iteration.
//Completed.
router.use(express.json());

router.get("/salt/:username/", routeFuncs.genrateSaltAndIt );

//So that express accept json in body

// post req when user creates a new acc.
//completed.
router.post("/create/account", routeFuncs.createAccount);

// queryFuncs.createTable_user_profile()

//get req to send whole login_details of user.
router.get("/vault/:username", routeFuncs.sendLoginData);

//post req when Existing User storing the password.
router.post("/savepassword/:username", routeFuncs.saveUserData );

//post req to validate user cendentials.
router.post("/login", routeFuncs.login );

//route to update user vault.
router.patch("/data/:username/:id", routeFuncs.updateUserData );

//route to delete data from login_detail.
router.delete("/data/:username/:id" , routeFuncs.deleteData);



module.exports = router;

