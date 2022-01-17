const express = require("express");

const router = express.Router();

router.get('/' , (req,res)=>{
    res.send("ye lo user ka pura data");
});




module.exports = router;
