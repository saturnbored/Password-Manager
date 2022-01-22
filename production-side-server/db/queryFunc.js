const sqlite3 = require("sqlite3");
const path = require("path");
const systemFuncs = require("../modules/systemFuncs");
const res = require("express/lib/response");
const { resolve } = require("path");
const { rejects } = require("assert");
const { query } = require("express");

//connection to database.
const db_path = path.resolve(`connections/password_manager_database.db`);
const db = new sqlite3.Database(db_path, (err) => {
  if (err) {
    console.error("Error in opening database..:(" + err);
  } else {
    console.log("db is connected....");
  }
});

const runQuery = function(queryStatement, options){ // options would contain an array
  return new Promise(function(resolve, reject){
    db.all(queryStatement, options, function(err, res){
      if(err)
        reject(err);
      else 
        resolve(res);
    })
  })
} 



//Creates Table which contails all users Login cendentials
async function createTable_user_profile() {
  new Promise(async (resolve , reject)=>{
    await db.run(
      "CREATE TABLE user_profile(\
              u_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
              username NVARCHAR(20) NOT NULL UNIQUE,\
              email NVARCHAR(319) NOT NULL UNIQUE,\
              mobileNo NVARCHAR(10) NOT NULL UNIQUE,\
              login_hash NVARCHAR(2000) NOT NULL\
              )",
      (err) => {
        if (err) {
          console.log({"Table already Exists.":err.message});
        }
      }
    );
    resolve("Table created");
  })
}



//creates table for user which contain data of perticular user
// function createLoginDetailTable(u_name) {
//   return new Promise((resolve, reject)=>{
//     db.run(
//       `CREATE TABLE ${u_name}_detail (\
//               id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
//               name NVARCHAR(20) NOT NULL,\
//               username NVARCHAR(20) NOT NULL,\
//               password NVARCHAR(300) NOT NULL,\
//               url NVACHAR(100) NOT NULL ,\
//               description NVARCHAR(300) NOT NULL,\
//               u_id INTEGER NOT NULL,\
//                   FOREIGN KEY (u_id) REFERENCES user_profile (u_id) \
//               )`,
//       (err) => {
//         if (err) {
//           reject("Table already Exists: " + err.message);
//         }
//         resolve(`Table ${u_name}detail is created.`);
//       }
      
//     );
//   })
// }



// insert data when new user creates account
// function insert_into_user_detail(reqData) {
//   // let reqData = req.body;
//   return new Promise((resolve, reject)=>{
//       db.run(
//         `INSERT INTO user_profile (username , email, mobileNo, login_hash) 
//          VALUES(?,?,?,?)`,
//         [reqData.username, reqData.email, reqData.mobileNo, reqData.login_hash],
//         (err, result) => {
//           if (err) {
//             reject(err.message);
//             return;
//           }
//           resolve(true);
//         }
//       );    
//   })
// }

const data2 ={
  "name" : "amazon",
  "username":"laksanfkanfkhA",
    "password": "lg123@gfc-sfskakfmail_com",
    "url": "http://www.amazon.com/login",
  "description": "Login data testing ......."
}
//insert data of perticular user
async function insertIntoLoginDetail(reqdata , userId){
  try {
    const result = await runQuery( `INSERT INTO login_detail (name , username , password , url ,description , u_id) VALUES(?,?,?,?,?,?)`, [reqdata.name , reqdata.username, reqdata.password, reqdata.url, reqdata.description , userId]);
    return true;
  } catch (error) {
    return error;
  }
    
}

// insertIntoLoginDetail(data2 , 2);



//Select queries
async function loginDetailData(uId) {
  try {
    const sqlQuery = `SELECT name , username , password , url , description FROM login_detail WHERE u_id =?`;
    const result = await runQuery(sqlQuery , uId);
    return result;
  } catch (error) {
    return error;
  }
}
//  loginDetailData(32);




// function user_detail_data(u_name) {
//   return new Promise((resolve, reject) => {
//     db.all(
//       `SELECT * FROM user_profile WHERE username = ?`,
//       u_name,
//       (err, data) => {
//         if (err) {
//           reject({ error: err.message });
//         }
//         resolve(data);
//       }
//     );
//   });
// }


  

async function createLoginDetailTable() {
    const sqlQuery = `CREATE TABLE login_detail (\
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
      name NVARCHAR(20) NOT NULL,\
      username NVARCHAR(20) NOT NULL,\
      password NVARCHAR(300) NOT NULL,\
      url NVACHAR(100) NOT NULL ,\
      description NVARCHAR(300) NOT NULL,\
      u_id INTEGER NOT NULL,\
          FOREIGN KEY (u_id) REFERENCES user_profile (u_id) \
      )`;
  try {
    const data = await  runQuery(sqlQuery);
  } catch (err) {
    
  }
  console.log(data);
}



async function insert_into_user_detail(reqData) {
   const result =  await runQuery(
          `INSERT INTO user_profile (username , email, mobileNo, login_hash) 
           VALUES(?,?,?,?)`,
          [reqData.username, reqData.email, reqData.mobileNo, reqData.login_hash],
        ); 
        console.log(result);   
  }

  // insert_into_user_detail(data);


async function user_detail_data(uName) {
  try {
    const data = await runQuery(`SELECT * FROM user_profile WHERE username = ?`,
        uName);
        return data;
  } catch (error) {
      console.log(error);
  }
  
}



//delete rows from userDetail table.
// How can we get name of table?
// function deleteRow_from_user_detail(req, res){
//   let name = req.params.name;
//   return new Promise((resolve , reject)=>{
//     db.run(`DELETE FROM `)
//   })
// }


async function deleteTable(t_name) {
  await db.run(`DROP TABLE ${t_name}`);
}




module.exports = {
  createTable_user_profile,
  createLoginDetailTable,
  deleteTable,
  insert_into_user_detail,
  insertIntoLoginDetail,
  loginDetailData,
  user_detail_data,
};
