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
        if(typeof cipherText != 'string'){
            resolve(cipherText);
        }
        const [IV, encrypted] = cipherText.split('$');
        if(!IV || !encrypted){
            resolve(cipherText); // gives an error without the return keyword: why?
        }
        else{
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
        }
    })
}

module.exports = {
    encrypt,
    decrypt
}