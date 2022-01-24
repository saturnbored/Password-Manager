const crypto = require('crypto');
const digest = 'sha256';

const generateHash = function(textBuffer, salt,  iterations, keyLen){
    return new Promise(async function(resolve, reject){
        try{
            const saltBuffer = Buffer.from(salt, 'hex');
            crypto.pbkdf2(textBuffer, saltBuffer, iterations, keyLen, digest, function(err, hash){
                if(err){
                    reject({msg: "An error occurred in pbkdf2", err});
                }
                resolve(`${iterations}$${saltBuffer.toString('hex')}$${hash.toString('hex')}`);
            })
        }
        catch(err){
            console.log(err);
            reject({msg: 'An error occurred in salt generation', err});
        }
    })
}

module.exports = {
    generateHash
}