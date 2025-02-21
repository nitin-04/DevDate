const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {
    try {
        //Validation of the Data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });
        // res.send(user)
        res.json({ message: "User Added Successfully!", data: savedUser })
        // res.send("User Added Successfully..!")
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    };
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials. Please try again")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send(user)
        }
        else {
            throw new Error("Invalid Credentials")
        }
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }


})


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()), })
    res.send("Logout Sucessfully.....");
});

module.exports = authRouter;