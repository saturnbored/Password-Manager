const { generateHash } = require("../../Client-server/utils/generateHash");

const queryFuncs = require("../db/queryFunc");

// let login_hash = "d2asf12dsf5sf5a5f5a$fsdgd5zggd42gfe5s5seg5$b4bFFBZDBSBFv16ZZDHb4zb4z6gdxh65tf465464ht5b4gf54x5x$g6z4g64s6g464r$z4hfdz464d646";
function saltAndIt(login_hash) {
  //implementation
  return new Promise(async (resolve, reject) => {
    try {
    const [client_it, client_salt] = await login_hash.split("$");
    const obj = {
        salt: `${client_salt}`,
        no_of_it: `${client_it}`
    };
  // console.log(obj);
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
      const newHash = await generateHash(
        hashString,
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
// hashAgain(data);

 function verifyPassword(obj) {
     return new Promise(async(resolve , reject)=>{
        try {
            const username = obj.username;
            const hashBeforeHashing = obj.login_hash;
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
}

module.exports = { saltAndIt, hashAgain, verifyPassword };
