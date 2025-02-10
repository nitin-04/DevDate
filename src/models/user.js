const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, //Mandatory
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true, //remove whitespaces
        required: true,
        unique: true, // Unique
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value);
            };
        },
    },
    age: {
        type: String,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender should be either male, female or other");
            }
        }
    },
    photoUrl:{
        type: String,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid URL" + value);
            };
        },
    },
    about:{
        type: String,
        default: "This is a default description"
    },
    skills:{
        type:[String],
    },
},{
    timestamps:true,
});

module.exports = mongoose.model("User", userSchema);