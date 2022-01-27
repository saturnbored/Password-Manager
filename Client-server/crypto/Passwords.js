const crypto = require('crypto');
const digest = 'sha256'; // algo to be used for hashing

const { generateHash } = require('../utils/generateHash');
const { generateRandomBytes} = require('../utils/randomBytes');

const hashPassword = function(passwordBuffer){
    return new Promise(async function(resolve, reject){
        try{
            const iterations = 100000; // number of iterations
            const keyLen = 32; // number of bytes of the desired hash
            const saltBuffer = await generateRandomBytes(keyLen);
            const salt = saltBuffer.toString('hex');
            const hash = await generateHash(passwordBuffer, salt, iterations, keyLen);               
            resolve(hash);
        }
        catch(err){
            console.log(err);
            reject(err);
        }
    })
}

const verifyPassword = async function(password, cipherText){
    const [iterationsStr, salt] = cipherText.split('$');
    const iterations = parseInt(iterationsStr, 10);
    try{
        const keyLen = 32;
        const passwordHash = await generateHash(password, salt, iterations, keyLen);
        if(passwordHash === cipherText){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {
    hashPassword,
    verifyPassword
}