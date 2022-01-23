/**
 * this file contains all the controllers for '../routes/loginRoutes.js'
 */

const axios = require('axios').create({baseUrl: "http://localhost:8080/"});

const { user, USER } = require('../crypto/USER');
/**
 * user object:
 * vault: array of JSON objects
 * getPasswordHash() // returns hash of the master password
 * getEncrypted(text: string/utf-8) // returns encrypted text
 * getDecrypted(encrypted: string/hex) // returns decrypted text
 */

/** 
 * req.body object: {
 *  username: string/utf-8,
 *  password: string/utf-8,
 *  email: string/utf-8,
 *  regMobNo: string
 * 
 * }
 */
const addNewUser = async function(req, res){
    try{
        const newUser = new USER;
        if(!req.body || !req.body.password || !req.body.username || !req.body.email || !req.body.regMobNo){
            return res.status(400).json({ msg: "All fields are required" });
        }
        const profileDetails = req.body;
        newUser.setDetails(profileDetails.username, profileDetails.password);
        profileDetails.password = await newUser.getPassswordHash();
        
        const result = await axios.post('create/user/', profileDetails);
        if(result.success)
            return res.status(201).json(result);
        else
            throw new Error("Internal server error");
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg: "Failed to create account", err});
    }
}

/** 
 * req.body object: {
 *  username: string/utf-8,
 *  password: string/utf-8,
 * }
 */
const loginUser = async function(req, res){
    user.setDetails(req.body.username, req.body.password);
    try{
        const {salt, iterations} = await axios.get('salt/', {
            params: {
                username: req.body.username
            }
        });
        // const saltBuffer = await generateRandomBytes(32);
        // const salt = saltBuffer.toString('hex');
        // const iterations = 100000;
        const passswordHash = await user.getPassswordHash(salt, iterations);
        const result = await axios.post('login/', { loginHash: passswordHash });
        // const result = { success: true };
        if(result.success){
            user.vault = await axios.get('vault/', {
                params: { username: req.body.username }
            });
            user.setVault();
            return res.status(200).json(user);
        }
        else{
            throw new Error("Internal server error");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({err});
    }
}

module.exports = {
    addNewUser,
    loginUser,
}