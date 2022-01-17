const sqlite3 = require("sqlite3");
const path = require("path");
const res = require("express/lib/response");
// const db = require("../src/server");

//connection to database.
const db_path = path.resolve(`connections/password_manager_database.db`);
const db = new sqlite3.Database(db_path, (err) => {
  if (err) {
    console.log("Error in opening database..:(" + err);
  } else {
    console.log("db is connected....");
  }
});

async function createTable_user_profile() {
  await db.run(
    "CREATE TABLE user_profile(\
            u_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            username NVARCHAR(20) NOT NULL,\
            email NVARCHAR(319) NOT NULL,\
            mobileNo INTEGER NOT NULL ,\
            login_hash NVARCHAR(2000) NOT NULL\
            )",
    (err) => {
      if (err) {
        console.log("Table already Exists.");
      }
    }
  );
}
async function createTable_login() {
  await db.run(
    "CREATE TABLE login_detail(\
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            username NVARCHAR(20) NOT NULL,\
            password NVARCHAR(300) NOT NULL,\
            url NVACHAR(100) NOT NULL ,\
            description NVARCHAR(300) NOT NULL,\
            u_id INTEGER NOT NULL,\
                FOREIGN KEY (u_id) REFERENCES user_profile (u_id) \
            )",
    (err) => {
      if (err) {
        console.log("Table already Exists: " + err.message);
      }
    }
  );
}

async function insert_into_user_detail(req, res){
  let reqData = req.body; 
  await db.run(
    `INSERT INTO user_profile [(username , email, mobileNo, login_hash)] \
     VALUES(?,?,?,?)`,
     [
       reqData.username,
       reqData.email,
       reqData.mobileNo,
       reqData.login_hash
     ]);
}

async function insert_into_login(req, res){
  let reqdata = req.body;
  await db.run(
    `INSERT INTO login_detail [(username , password , url ,description)] VALUES(?,?,?,?)` ,
    [
      reqdata.username,
      reqdata.password,
      reqdata.url,
      reqdata.description
    ]
  );
}



//Select queries
async function login_detail_data(){
  db.all(`SELECT * FROM login_detail` ,[],(err,data)=>{
    if (err) {
      res.status(400).json({"error" : err.message});
    }
    res.status(200).json(data);
  })
}




async function deleteTable(t_name) {
  await db.run(`DROP TABLE ${t_name}`);
}

module.exports = { createTable_user_profile, createTable_login, deleteTable , insert_into_user_detail ,insert_into_login , login_detail_data};
