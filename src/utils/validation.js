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

module.exports = {
    validateSignUpData,
};
