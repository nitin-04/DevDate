const express = require('express');
const mongooseDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cores = require('cores');
// const jwt = require('jsonwebtoken');

app.use(
    cores({
        origin: "http://localhost:5173" ,
        credentials: true,

    }))

app.use(express.json()); //middleware-convert json data that comes from the postman 
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);





//Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(404).send("User emalID not found")
        }
        else {
            res.send(user);
        }
    }
    catch {
        res.status(404).send("User emalID not found")
    }
})


//Feed API - GET/ feed -- get all the users from Database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        res.status(404).send("Error getting feed");
    }
})

//Delete User from the Database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("User ID not found")
        }
        else {
            res.send("User deleted Successfully..!")
        }
    }

    catch {
        res.status(404).send("Error deleting user");
    }
})

//Update user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "about",
            "skills",
            "gender",
            "age",

        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed");
        }

        if (data?.skills.length > 12) {
            throw new Error("Skills can't exceed 12");
        }


        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true })
        res.send("User updated successfully..")
    }
    catch (err) {
        res.status(404).send("UPDATE FAILED:" + err.message)
    }
})

mongooseDB()
    .then(() => {
        console.log("connection Established Successfully...")
        app.listen(4444, () => {
            console.log('Server is running on port 4444');
        });
    })
    .catch((err) => {
        console.error("connection cannot be established");
    });




