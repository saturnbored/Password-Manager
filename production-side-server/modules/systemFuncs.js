
const {generateHash} = require("../../Client-server/utils/generateHash");
const {generateRandomBytes} = require("../../Client-server/utils/randomBytes");
const queryFuncs = require("../db/queryFunc");


// let login_hash = "d2asf12dsf5sf5a5f5a$fsdgd5zggd42gfe5s5seg5$b4bFFBZDBSBFv16ZZDHb4zb4z6gdxh65tf465464ht5b4gf54x5x$g6z4g64s6g464r$z4hfdz464d646";
async function salt_it(login_hash){
//implementation
  let [server_it,server_salt ,client_it, client_salt]= await login_hash.split('$');
    let obj = {
        salt : `${client_salt}`,
        no_of_it : `${client_it}`
    }
    // console.log(obj);
    return new Promise((resolve , reject )=>{
        try {
            resolve(obj);   
        } catch (error) {
            reject(error);
        }
    })
}


// const data = {
//     "username":"lakshA",
//     "email": "lg123@gmail.com",
//     "mobileNo": 12124234355555289,
//     "login_hash": "b4bFFBZDBSBFv16ZZDHb4zb4z6gdxh65tf465464ht5b4gf54x5x$g6z4g64s6g464r$z4hfdz464d646"
// }
function hashAgain(data){
    return new Promise(async(resolve , reject)=>{
        try {
            const server_it = 100000;
            const keyLen = 32;
            let [client_it, client_salt, hashString]= await data.login_hash.split('$');
            const saltBuffer = await generateRandomBytes(keyLen);
            const server_salt = saltBuffer.toString('hex');
            let newHash = await generateHash(hashString , server_salt , server_it , keyLen );
            data.login_hash=`${client_it}$${client_salt}$${newHash}`;
            resolve(data);
        } 
        catch (error) {
            console.log(error);
            reject(error);
        }        
    })    
}
// hashAgain(data);


async function verifyPassword(obj){
    const username = obj.username;
    const login_hash = obj.login_hash;
    const data = await queryFuncs.user_detail_data(username);
    const storedHash = data[0].login_hash;

}


module.exports = {salt_it};