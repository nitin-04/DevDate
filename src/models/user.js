const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailId: {
        tupe: String,
    },
    password: {
        type: String,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);