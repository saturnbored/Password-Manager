/**
 * this file contains all the controllers for '../routes/loginRoutes.js'
 */

const axios = require('axios');

const { user, USER } = require('../crypto/USER');
/**
 * user object:
 * vault: array of JSON objects
 * getPasswordHash() // returns hash of the master password
 * getEncrypted(text: string/utf-8) // returns encrypted text
 * getDecrypted(encrypted: string/hex) // returns decrypted text
 */

const { localStorage } = require('../storage/LocalStorage');
/** 
 * localStorage to be used just like localStorage feature of browsers
 */

/** 
 * req.body object: {
 *  username: string/utf-8,
 *  password: string/utf-8,
 *  email: string/utf-8,
 *  mobileNo: string
 * 
 * }
 */

const addNewUser = async function(req, res){
    try{
        const newUser = new USER;
        if(!req.body || !req.body.password || !req.body.username || !req.body.email || !req.body.mobileNo){
            return res.status(400).json({ msg: "All fields are required" });
        }
        const profileDetails = req.body;
        newUser.setDetails(profileDetails.username, profileDetails.password);
        profileDetails.password = await newUser.getPassswordHash();
        const result = await axios.post('http://localhost:8080/userdata/create/account/', profileDetails);

        console.log(result.data);
        if(result.data.success)
            return res.status(201).json(result.data);
        else
            throw new Error("Internal server error");
        
    }
    catch(err){
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
        let response = await axios.get(`http://localhost:8080/userdata/salt/${user.username}`);
        const salt = response.data.salt;
        const iterations = parseInt(response.data.iterations, 10);
        const passswordHash = await user.getPassswordHash(salt, iterations);
        response = await axios.post('http://localhost:8080/userdata/login/', { 
            username: user.username,
            loginHash: passswordHash });

        console.log(response.data);
        if(response.data.success){
            localStorage.setItem('accessToken', response.data.token);
            response = await axios.get(`http://localhost:8080/userdata/vault/${user.username}`);
            console.log(response.data);
            user.vault = response.data;
            await user.setVault();
            return res.status(200).json(user);
        }
        else{
            throw new Error("Internal server error");
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json('OOPS');
    }
}

module.exports = {
    addNewUser,
    loginUser,
}