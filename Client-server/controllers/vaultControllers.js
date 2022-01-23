/**
 * this file contains all the controllers for '../routes/vaultRouter.js'
 * 
*/
const axios = require('axios').create({ baseUrl: "http://localhost:8080/" });

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
const addItem = async function(req, res){

    try {
        const encryptedDetails = req.body;
        encryptedDetails.username = await user.getEncrypted(req.body.username);
        encryptedDetails.password = await user.getEncrypted(encryptedDetails.password);
        encryptedDetails.url = await user.getEncrypted(encryptedDetails.url);
        encryptedDetails.description = await user.getEncrypted(encryptedDetails.description);
        const result = await axios.post('savepassword/', encryptedDetails, {
            params: { username: user.username }
        })
        // const result = {success: true};
        if(result.success){
            user.vault.push(req.body);
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
        // console.log(item);
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
        // console.log(item);
        if(!item){
            return res.status(404).json({ msg: "No resource found" });
        }
        for(const field in item){
            item[field] = await user.getDecrypted(item[field]);
        }
        for(const field in updatedItem){
            if(item[field] !== updatedItem[field]){
                item[field] = updatedItem[field];
            }
        }
        for(let obj in user.vault){
            if(obj.name === req.params.name){
                obj = item;
                break;
            }
        }
        const result = await axios.patch('data/', item, {
            params: {
                username: user.username,
                id: item.id
            }
        });
        if(result.sucess){
            return res.status(200).json({item});
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
        // console.log(item);
        if(!item){
            return res.status(404).json({ msg: "No resource found" });
        }
        const result = await axios.delete('data/',{
            params: {
                username: user.username,
                id: item.id
            }
        })
        if(result.success){
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
        for(const obj in user.vault){
            for(const field in obj){
                obj[field] = await user.vault.getDecrypted(obj[field]);
            }
        };
        return res.status(200).json({vault: user.vault});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err });
    }
}

// GET the entire encrypted vault 
const getEncryptedVault = async function(req, res){
    try {
        const encryptedVault = await axios.get('vault/', { 
            params: {username: user.username}
        })
        return res.status(200).json(encryptedVault);
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