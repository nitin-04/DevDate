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
    about: {
        type: String,
        default: "This is a default description"
    },
    photoUrl: {
        type: String,
        default: "https://thehotelexperience.com/wp-content/uploads/2019/08/default-avatar.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL" + value);
            };
        },
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