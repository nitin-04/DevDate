const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

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
    },
    age: {
        type: String,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: "{VALUE} is not a valid gender"
        }

    },
    photoUrl: {
        type: String,
        default: "https://i.pinimg.com/originals/7d/07/74/7d0774c44f6768a8e5696edff37731e9.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL" + value);
            };
        },
    },
    about: {
        type: String,
        default: "This is a default description"
    },
    skills: {
        type: [String],
    },
}, {
    timestamps: true,
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@Date$2025", { expiresIn: "7d" });
    return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);