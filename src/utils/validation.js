const validator = require("validator");


const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter a valid first name or last name")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
};

const vallidateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "about",
        "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field));
    
    return isEditAllowed;
};



module.exports = {
    validateSignUpData,
    vallidateEditProfileData,
};
