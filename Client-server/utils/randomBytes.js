
const crypto = require('crypto');

const generateRandomBytes = function(len){
    return new Promise(function(resolve, reject){
        crypto.randomBytes(len, function(err, buff){
            if(err){
                console.log(err);
                reject({msg: "An error occurred in randomBytes", err});
            }
            resolve(buff); // returns a Buffer object
        })
    })
}

module.exports = {
    generateRandomBytes
}