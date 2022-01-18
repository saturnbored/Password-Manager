/**
 * this file contains all the controllers for '../routes/vaultRouter.js'
 * 
*/

const {encrypt, decrypt} = require('../crypto/Encryption');
/** 
 * encrypt(text: string/utf-8, key: string/hex)
 * encrypt returns a Promise of string(hex)
 * 
 * decrypt(cipherText: string/hex, key: string/hex)
 * decrypt returns a Promise of string(utf-8)
*/

const {generateRandomBytes} = require('../utils/randomBytes');

/** 
 * addItem:(to add an item to login_details table in database)
 * req.body will contain the following key value pairs:
 * name: <the name under which the user will be storing this info
 * username: <username>
 * password: <password for the username>
 * url: <url for which the user has provided the above username and passwords>
 * description: <additional descriptions that the user would add as a note>
 * we will return a JSON object {
 *  sucess: <true/false>,
 *  addedInfo: <the info that was added to login_details table>
 * }
*/
const addItem = async function(req, res){

    try {
        
        // temporarily using a randomKey for testing
        const keyBuffer = await generateRandomBytes(32);
        const key = keyBuffer.toString('hex');
        
        let encryptedDetails = req.body;
        
        if(!encryptedDetails.name){
            return res.status(400).json({
                msg: "Name is a required field"
            });
        }
        
        encryptedDetails.name = await encrypt(encryptedDetails.name, key);
        encryptedDetails.username = await encrypt(encryptedDetails.username, key);
        encryptedDetails.password = await encrypt(encryptedDetails.password, key);
        encryptedDetails.url = await encrypt(encryptedDetails.url, key);
        encryptedDetails.description = await encrypt(encryptedDetails.description, key);
        
        return res.status(201).json(encryptedDetails);

    } catch (err) {
        console.log(err);
         return res.status(500).json({
            msg: "An unexpected error occurred"
        });
    }
}

/** 
 * getItem: (to get a particular login_detail which will be specified by the name)
 * req will contain the params: name
 */
const getItem = function(req, res){
    console.log(req);
}

const updateItem = async function(req, res){
    try {
        
        // temporarily using a randomKey for testing
        const keyBuffer = await generateRandomBytes(32);
        const key = keyBuffer.toString('hex');
        
        let encryptedDetails = req.body;
        
        if(!encryptedDetails.name){
            return res.status(400).json({
                msg: "Name is a required field"
            });
        }
        if(encryptedDetails.name)
            encryptedDetails.name = await encrypt(encryptedDetails.name, key);
        
        if(encryptedDetails.username)
            encryptedDetails.username = await encrypt(encryptedDetails.username, key);
    
        if(encryptedDetails.password)
            encryptedDetails.password = await encrypt(encryptedDetails.password, key);

        if(encryptedDetails.url)
            encryptedDetails.url = await encrypt(encryptedDetails.url, key);
        
        if(encryptedDetails.description)
            encryptedDetails.description= await encrypt(encryptedDetails.description, key);
        
        return res.status(200).json(encryptedDetails);


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "An unexpected error occurred"
        });
    }
}

const deleteItem = function(req, res){
    console.log(req);
}

const getDecryptedVault = function(req, res){
    console.log(req);
}

const getEncryptedVault = function(req, res){
    console.log(req);
}

module.exports = {
    addItem,
    getItem,
    updateItem,
    deleteItem,
    getDecryptedVault,
    getEncryptedVault
}