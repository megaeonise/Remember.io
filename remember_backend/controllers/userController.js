const userModel = require('../models/userModel');

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Please Enter Your Name"
            });
        }

        
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "email is required"
            });
        }

        
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "password is required and should be min 6 character long"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already exists"
            });
        }

        const user = await userModel({
            name,
            email,
            password
        }).save();
        return res.status(200).send({
            success: true,
            message: "User registered successfully"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in registration",
            error
        });
    }
};

module.exports = { registerController };