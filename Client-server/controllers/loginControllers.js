/**
 * this file contains all the controllers for '../routes/loginRoutes.js'
 */

const axios = require('axios').create({baseUrl: "http://localhost:8080/"});

const { USER } = require('../crypto/USER');

const user = new USER;

console.log(user);

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

const loginUser = async function(req, res){
    user.setDetails(req.body.username, req.body.password);
    try{
        const {salt, iterations} = await axios.get('salt/', {
            params: {
                username: req.body.username
            }
        });
        const passswordHash = await user.getPassswordHash(salt, iterations);
        const result = await axios.post('login/', { loginHash: passswordHash });
        if(result.success){
            user.vault = await axios.get('vault/', {
                params: { username: req.body.username }
            });
            return res.status(200).json(result.message);
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
    user
}