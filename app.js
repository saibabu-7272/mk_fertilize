const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const DBpath = path.join(__dirname, "mk_fertilize_db.db")
let db 
const app = express();
app.use(express.json())
app.use(cors());

const initDB = async ()=>{
    try{
        db = await open({
        filename : DBpath,
        driver : sqlite3.Database
    },

    app.listen(3000, ()=>{
        console.log("server started and running at port 3000");
    })
    

    )}catch(e){
        console.log(e)
    }
}

initDB()


// Register API 

app.post("/register", async (req, res)=>{
    const {username, password} = req.body
    const registerQuery = `
    INSERT INTO mk_users (username, password) 
    VALUES ("${username}", "${password}");
    `
    await db.run(registerQuery)
    
    res.send({token})
})

//Login API 

app.post("/", async (req, res)=>{
    const {username, password} = req.body
    const selectQuery = `
    SELECT * FROM mk_users WHERE username = "${username}";
    `
    const dbData = await db.all(selectQuery)
    if(dbData === undefined){
        res.status(400)
        res.send("Invalid Username")
    }else{
        if(password === dbData.password){
            const payload = {
                username : `${username}`
            }
            const token = jwt.sign(payload, "SECRET_KEY")
            res.send({token})

        }else{
            res.status(400)
            res.send("Invalid Password")
        }
    }
    
})



app.get("/", async (req, res)=>{
    const query = `
    SELECT * FROM mk_users;
    `
    const data = await db.all(query)
    const payload = {
        username : "darling"
    }
    const token = jwt.sign(payload, "secret")

    res.send({token})
})

// insert data into Main stocks 
app.post("/insert", async (req, res)=>{
    const {id, productName, quantity} = req.body 
    const insertQuery = `
    INSERT into mainstocks (id,product_name,quantity) 
    VALUES(${id},'${productName}',${quantity});
    `
    await db.run(insertQuery);
    res.send("Succesfully data inserted");
})

app.get("/display", async (req, res)=>{
    const getQuery = `
    SELECT * FROM mainstocks;
    `
    const data = await db.all(getQuery);
    res.send(data)
})
