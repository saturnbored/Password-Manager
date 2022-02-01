const sqlite3 = require("sqlite3");
const path = require("path");
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
  try {
    const sqlQuery = "CREATE TABLE user_profile(\
      u_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
      username NVARCHAR(20) NOT NULL UNIQUE,\
      email NVARCHAR(319) NOT NULL UNIQUE,\
      mobileNo NVARCHAR(10) NOT NULL UNIQUE,\
      login_hash NVARCHAR(2000) NOT NULL\
      )";
    const result = await runQuery(sqlQuery);
    return result;
  } catch (error) {
    return error;
  }
}
// createTable_user_profile();



//creates table for users to store their login details.
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
    await runQuery(sqlQuery);
    return true ;

  } catch (err) {
    return err;
  }
}
// createLoginDetailTable();

// insert data when new user creates account
async function InsertIntoUserDetail(reqData) {
  try {
    const result =  await runQuery(
      `INSERT INTO user_profile (username , email, mobileNo, login_hash) 
       VALUES(?,?,?,?)`,
      [reqData.username, reqData.email, reqData.mobileNo, reqData.login_hash],
    ); 
    return true; 
  } catch (error) {
    return error;
  }  
}



//insert data of perticular user
async function insertIntoLoginDetail(reqdata , userId){
  try {
    await runQuery( `INSERT INTO login_detail (name , username , password , url ,description , u_id) VALUES(?,?,?,?,?,?)`, [reqdata.name , reqdata.username, reqdata.password, reqdata.url, reqdata.description , userId]);
    return true;
  } catch (error) {
    return error;
  } 
}

//Select queries
async function userLoginData(uId) {
  try {
    const sqlQuery = `SELECT id ,name , username , password , url , description FROM login_detail WHERE u_id =?`;
    const result = await runQuery(sqlQuery , uId);
    return result;
  } catch (error) {
    return error;
  }
}
async function userIdFromLoginDetail(uId) {
  try {
    const sqlQuery = `SELECT u_id  FROM login_detail WHERE id =?`;
    const result = await runQuery(sqlQuery , uId);
    return result;
  } catch (error) {
    return error;
  }
}

async function userDetailData(uName) {
  try {
      const data = await runQuery(`SELECT * FROM user_profile WHERE username = ?`,
          uName);
      return data;
  } catch (error){
      return error;
  }
}


//update query.
async function updateUserData(id , data){
  try {
    const col = Object.keys(data);
    const val = Object.values(data);
    let s = `UPDATE login_detail SET`;
    for (let i = 0; i < col.length; i++) {
      s += ` ${col[i]} = "${val[i]}",`;
    }
    let sqlQuery = s.substring(0, s.length-1) + ` WHERE id = ?`; 
    await runQuery(sqlQuery , id);
    return true;
  } catch (error) {
    return error;
  }
}

// delete rows from userDetail table.
async function deleteRowInLoginDetail(id){
  try {
    const sqlQuery = `DELETE FROM login_detail WHERE id=?`;
    await runQuery(sqlQuery,id);
    return true;
  } catch (error) {
    return error;
  }
}

async function deleteTable(t_name) {
  try {
    const result = await db.run(`DROP TABLE ${t_name}`);
    return true;
  } catch (error) {
    return error;
  }
}


module.exports = {
  createTable_user_profile,
  createLoginDetailTable,
  deleteTable,
  InsertIntoUserDetail,
  insertIntoLoginDetail,
  userLoginData,
  userIdFromLoginDetail,
  updateUserData,
  userDetailData,
  deleteRowInLoginDetail
};
