

// let login_hash = "d2asf12dsf5sf5a5f5a$fsdgd5zggd42gfe5s5seg5$b4bFFBZDBSBFv16ZZDHb4zb4z6gdxh65tf465464ht5b4gf54x5x$g6z4g64s6g464r$z4hfdz464d646";



function salt_it(login_hash){
//implementation
  let [server_it,server_salt ,client_it, client_salt]=login_hash.split('$');
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

module.exports = {salt_it};