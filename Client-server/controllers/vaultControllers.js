/**
 * this file contains all the controllers for '../routes/vaultRouter.js'
 * 
*/
const axios = require('axios');

const { addAuthorizationHeader } = require('../middleware/tokenInterceptorAxios');

const {user} = require('../crypto/USER');
/**
 * user object:
 * vault: array of JSON objects
 * getEncrypted(text: string/utf-8) // returns encrypted text
 * getDecrypted(encrypted: string/hex) // returns decrypted text
 */

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

axios.interceptors.request.use(addAuthorizationHeader);

const addItem = async function(req, res){

    try {
        const encryptedDetails = req.body;
        encryptedDetails.name = await user.getEncrypted(req.body.name);
        encryptedDetails.username = await user.getEncrypted(req.body.username);
        encryptedDetails.password = await user.getEncrypted(encryptedDetails.password);
        encryptedDetails.url = await user.getEncrypted(encryptedDetails.url);
        encryptedDetails.description = await user.getEncrypted(encryptedDetails.description);
        const response = await axios.post(`http://localhost:8080/userdata/savepassword/${user.username}`, encryptedDetails);
        if(response.data.success){
            encryptedDetails.name = await user.getDecrypted(encryptedDetails.name);
            user.vault.push(encryptedDetails);
            return res.status(201).json({ success: true, addedInfo: encryptedDetails });
        }
        else{
            throw new Error("Internal server error");
        }

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
const getItem = async function(req, res){
    try{
        let [item] = user.vault.filter(function(obj){
            return obj.name === req.params.name;
        });
        if(!item){
            return res.status(404).json({ msg: "No resource found" });
        }
        for(const field in item){
            if(field === 'id' || field == 'name') continue;
            item[field] = await user.getDecrypted(item[field]);
        }
        return res.status(200).json({ success: true, data: item });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ success: false, err });
    }
}

/** 
 * updateItem: (to update a particular login_detail which will be specified by the name)
 * req will contain the params: name
 * re.body may contain:
 * name: <the name under which the user will be storing this info
 * username: <username>
 * password: <password for the username>
 * url: <url for which the user has provided the above username and passwords>
 * description: <additional descriptions that the user would add as a note>
 */
const updateItem = async function(req, res){
    try {
        let updatedItem = req.body;
        let [item] = user.vault.filter(function(obj){
            return obj.name === req.params.name;
        });
        if(!item){
            return res.status(404).json({ msg: "No resource found" });
        }
        for(const field in item){
            const encryptedField = item[field];
            item[field] = await user.getDecrypted(encryptedField);
        }
        for(const field in updatedItem){
            if(item[field] !== updatedItem[field]){
                item[field] = updatedItem[field];
            }
        }
        for(const field in item){
            if(field != 'id')
                item[field] = await user.getEncrypted(item[field]);
        }
        const response = await axios.patch(`http://localhost:8080/userdata/data/${user.username}/${item.id}`, item);
        if(response.data.success){
            item.name = await user.getDecrypted(item.name);
            return res.status(200).json(response.data);
        }
        else{
            throw new Error("Internal Server Error");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
}

/** 
 * deleteItem: (to delete a particular login_detail which will be specified by the name)
 * req will contain the params: name
 */
const deleteItem = async function(req, res){
    try{
        let [item] = user.vault.filter(function(obj){
            return obj.name === req.params.name;
        });
        if(!item){
            return res.status(404).json({ msg: "No resource found" });
        }
        const response = await axios.delete(`http://localhost:8080/userdata/data/${user.username}/${item.id}`);
        if(response.data.success){
            user.vault.splice(user.vault.findIndex(obj => obj.id === item.id), 1);
            return res.status(200).json({success: true, msg: "Deleted successfully"})
        }
        else{
            throw new Error("Internal Server Error");
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err});
    }  
}

// GET the entire decrypted vault
const getDecryptedVault = async function(req, res){
    try {
        for(let i = 0; i < user.vault.length; i++){
            for(const field in user.vault[i]){
                user.vault[i][field] = await user.getDecrypted(user.vault[i][field]);
            }
        }
        return res.status(200).json({vault: user.vault});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
}

// GET the entire encrypted vault 
const getEncryptedVault = async function(req, res){
    try {
        const response = await axios.get(`http://localhost:8080/userdata/vault/${user.username}`);
        return res.status(200).json(response.data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({err});
    }
}

module.exports = {
    addItem,
    getItem,
    updateItem,
    deleteItem,
    getDecryptedVault,
    getEncryptedVault
}