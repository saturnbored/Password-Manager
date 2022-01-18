const crypto = require('crypto');
const { generateRandomBytes } = require('../utils/randomBytes');
const algorithm = 'aes-256-cbc'; // algorithm to be used for cipher

const encrypt = function(text, key){
    const IVLen = 16;
    return new Promise(async function(resolve, reject){
        try{
            const IVBuffer = await generateRandomBytes(IVLen);
            const keyBuffer = Buffer.from(key, 'hex');
            const cipher = crypto.createCipheriv(algorithm, keyBuffer, IVBuffer);
            let cipherText = cipher.update(text, 'utf-8');
            cipherText = Buffer.concat([cipherText, cipher.final()]);
            resolve(`${IVBuffer.toString('hex')}$${cipherText.toString('hex')}`);
        }
        catch(err){
            console.log(err);
            reject({msg: "An error occurred in encrypt", err})
        }
    })
}

const decrypt = function(cipherText, key){
    return new Promise(function(resolve, reject){
        const [IV, encrypted] = cipherText.split('$');
        if(!IV || !encrypted){
            reject({msg: "cipherText is invalid"});
        }
        const keyBuffer = Buffer.from(key, 'hex');
        const IVBuffer = Buffer.from(IV, 'hex');
        try{
            const decipher = crypto.createDecipheriv(algorithm, keyBuffer, IVBuffer);
            let plainText = decipher.update(encrypted, 'hex');
            plainText = Buffer.concat([plainText, decipher.final()]);
            resolve(plainText.toString('utf-8'));
        }
        catch(err){
            console.log(err);
            reject({msg: "An error occurred in decrypt", err});
        }
    })
}

/* const plainText = 'this is the un-encrypted text';

const check = async function(text){
    try{
        const keyBuffer = await generateRandomBytes(32);
        const key = keyBuffer.toString('hex');
        const cipherText = await encrypt(text, key);
        const decrypted = await decrypt(cipherText, key);
        if(decrypted === text)
            console.log('Matched');
        else 
            console.log('Did not match');
    }
    catch(err){
        console.log(err);
    }
}

check(plainText); */

module.exports = {
    encrypt,
    decrypt
}