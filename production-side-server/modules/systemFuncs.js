const { generateHash } = require("../../Client-server/utils/generateHash");

const queryFuncs = require("../db/queryFunc");


function saltAndIt(login_hash) {
  //implementation
  return new Promise(async (resolve, reject) => {
    try {
    const [client_it, client_salt] = await login_hash.split("$");
    const obj = {
        salt: `${client_salt}`,
        iterations: `${client_it}`
    };
      resolve(obj);
    } catch (error) {
      reject(error);
    }
  });
}


function hashAgain(data , salt ) {
  return new Promise(async (resolve, reject) => {
    try {
      const server_it = 100000;
      const keyLen = 32;
      const [client_it, client_salt, hashString] = await data.split("$"); 
      const hashStringBuff = Buffer.from(hashString , 'hex');
      const newHash = await generateHash(
        hashStringBuff,
        salt,
        server_it,
        keyLen
      );
      data = `${client_it}$${client_salt}$${newHash}`;
      resolve(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}


 function verifyPassword(obj) {
     return new Promise(async(resolve , reject)=>{
        try {
            const username = obj.username;
            const hashBeforeHashing = obj.loginHash;
            const data = await queryFuncs.userDetailData(username);
            const storedHash = data[0].login_hash;
            const salt = await storedHash.split("$")[3];
            const newHash = await hashAgain(hashBeforeHashing,salt);
            if (newHash === storedHash) {
              resolve(true);
            } else {
              reject(false);
            }
          } catch (error) {
            reject (error);
          }
     });
};

module.exports = {saltAndIt, hashAgain, verifyPassword};
