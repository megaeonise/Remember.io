const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword} = require('../helpers/authHelper');
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

        const hashedPassword = await hashPassword(password);
        
        const user = await userModel({
            name,
            email,
            password: hashedPassword,
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


const loginController = async(req,res) => {

try {
    
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            success: false,
            message: "Please provide email and password"
        });
    }
    const user = await userModel.findOne({email});
    if (!user){
        return res.status(500).send({
            success: false,
            message: "User not found"
        });
    }

    const match = await comparePassword(password,user.password);
    if(!match){
        return res.status(500).send({
            success: false,
            message: "Invalid email or password",
        });
    }

    const token = await jwt.sign(

        {_id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"},
    )

    user.password = undefined;
    res.status(200).send({
        success: true,
        message: "Login successful",
        token,
        user
    })
} catch (error) {
    
    console.log(error);
    return res.status(500).send({
        
        success: false,
        message: "Error in login",
        error
    });
}

    
};
 
module.exports = {registerController,loginController}