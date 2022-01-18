const sqlite3 = require("sqlite3");
const path = require("path");
const res = require("express/lib/response");
const { resolve } = require("path");
const { rejects } = require("assert");


//connection to database.
const db_path = path.resolve(`connections/password_manager_database.db`);
const db = new sqlite3.Database(db_path, (err) => {
  if (err) {
    console.log("Error in opening database..:(" + err);
  } else {
    console.log("db is connected....");
  }
});

//Creates Table which contails all users Login cendentials
function createTable_user_profile() {
  db.run(
    "CREATE TABLE user_profile(\
            u_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            username NVARCHAR(20) NOT NULL UNIQUE,\
            email NVARCHAR(319) NOT NULL UNIQUE,\
            mobileNo INTEGER NOT NULL UNIQUE,\
            login_hash NVARCHAR(2000) NOT NULL\
            )",
    (err) => {
      if (err) {
        console.log("Table already Exists.");
      }
    }
  );
}

//creates table for user which contain data of perticular user
async function createTable_login(u_name) {
  await db.run(
    `CREATE TABLE ${u_name}detail (\
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            username NVARCHAR(20) NOT NULL,\
            password NVARCHAR(300) NOT NULL,\
            url NVACHAR(100) NOT NULL ,\
            description NVARCHAR(300) NOT NULL,\
            u_id INTEGER NOT NULL,\
                FOREIGN KEY (u_id) REFERENCES user_profile (u_id) \
            )`,
    (err) => {
      if (err) {
        console.log("Table already Exists: " + err.message);
      }
    }
  );
}


//insert data when new user creates account
function insert_into_user_detail(req,res){
  let reqData = req.body; 
    db.run(
    `INSERT INTO user_profile (username , email, mobileNo, login_hash) 
     VALUES(?,?,?,?)`,
     [
       reqData.username,
       reqData.email,
       reqData.mobileNo,
       reqData.login_hash
     ],(err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(reqData);
    });
}

//insert data of perticular user
async function insert_into_login(u_name,req,res){
  let reqdata = req.body;
  await db.run(
    `INSERT INTO ${u_name}detail [(username , password , url ,description)] VALUES(?,?,?,?)` ,
    [
      reqdata.username,
      reqdata.password,
      reqdata.url,
      reqdata.description
    ],(err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(reqBody);
    }
  );
}



//Select queries
async function login_detail_data(u_name, res){
  await db.all(`SELECT * FROM ${u_name}detail` ,[],(err,data)=>{
    if (err) {
      res.status(400).json({"error" : err.message});
    }
    res.status(200).json(data);
  })
}


 function user_detail_data(req,res){
   let u_name = req.params.username;
   let hash_val = "ajdaei";

   return new Promise((resolve , reject )=>{
     setTimeout(() => {
      db.all(`SELECT * FROM user_profile WHERE username = ?`,u_name,(err,data)=>{
        if (err) {
          reject({"error" : err.message});
        }
      resolve(data);
      });
      //  console.log("called sencond");
     }, 1000);
      

   });
  
}








async function deleteTable(t_name) {
  await db.run(`DROP TABLE ${t_name}`);
}


module.exports = { createTable_user_profile, createTable_login, deleteTable , insert_into_user_detail ,insert_into_login , login_detail_data ,user_detail_data};
