const { generateHash } = require('../utils/generateHash');
const { hashPassword } = require('./Passwords');
const { encrypt, decrypt } = require('./Encryption');

class USER{
    #key; // encryption key
    #password;  // this stores the Buffer of the Master Password
    #keyLen = 32; // bytes of encryption key
    #keyIterations = 1e4; // iterations for generating encryption key
    
    username; // username of the user
    vault = [];

    setDetails(username, password){
        this.#password = Buffer.from(password, 'utf-8');
        this.username = username;
    }

    // #generateKey will set the encryption key in this.#key
    async #generateKey(hash){
        try{
            const hashBuffer = Buffer.from(hash.split('$')[2], 'hex');
            this.#key = await generateHash(hashBuffer, this.username, this.#keyIterations, this.#keyLen);
            this.#key = this.#key.split('$')[2];
        }
        catch(err){
            console.log(err);
        }
    }
    
    // this will generate the hash of this.#password and call this.#generateKey()
    getPassswordHash(salt, iterations){
        const that = this;
        return new Promise(async function(resolve, reject){
            try{
                if(!salt && !iterations){ // generating hash for the first time
                    // creation of profile
                    const hash = await hashPassword(that.#password);
                    await that.#generateKey(hash);
                    resolve(hash);
                }
                else if(!salt || !iterations){
                    reject({
                        msg: "Could not hash password, must pass iterations and salt"
                    });
                }
                else{
                    const hash = await generateHash(that.#password, salt, iterations, that.#keyLen);
                    await that.#generateKey(hash);
                    resolve(hash);
                }
            }
            catch(err){
                console.log(err);
                reject({
                    msg: "An error occurred in getPasswordHash method",
                    err
                });
            }
        })    
    }
    
    // function to encrypt text using this.#key
    getEncrypted(text){
        const that = this;
        return new Promise(async function(resolve, reject){
            try{
                const encrypted = await encrypt(text, that.#key);
                resolve(encrypted);
            }
            catch(err){
                console.log(err);
                reject({
                    msg: "An error occurred in encrypt method",
                    err
                });
            }
        })
    }
    
    //function to decrypt ciphertext using this.#key
    getDecrypted(encrypted){
        const that = this;
        return new Promise(async function(resolve, reject){
            try {
                const decrypted = await decrypt(encrypted, that.#key);
                resolve(decrypted);                
            } catch (err) {
                reject({
                    msg: "An error occurred in decrypt method",
                    err
                })
            }
        })
    }
    
    async setVault(){
        const that = this;
        try{
            for(let i = 0; i < that.vault.length; i++){
                const encryptedName = that.vault[i].name;
                that.vault[i].name = await that.getDecrypted(encryptedName);
            }
        }
        catch(err){
            console.log("Error in SetVault");
            console.log(err);
        }
    }
}

const user = new USER;

module.exports = {
    USER,
    user
}