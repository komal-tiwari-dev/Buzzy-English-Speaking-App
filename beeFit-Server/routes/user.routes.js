const express = require('express');
const UserModel = require("../Models/User.model");
const bcrypt = require('bcrypt');
const userController = express.Router();
require("dotenv").config();
let jwt = require('jsonwebtoken');

//Sign Up

userController.post("/signup", (req, res) => {
    const { username, role, email, password } = req.body;
    bcrypt.hash(password, 6, async (err, hash) => {
        if (err) {
            return res.send("Please try again");
        }
        const user = new UserModel({
            username,
            role,
            email,
            password: hash
        })
        await user.save();
    })
    res.send("Sign Up Sucessfull");
})

//Sign In

userController.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.find({ email });
    if (!user) {
        return res.send("Invalid Credentials")
    }
    const hash = user.password;
    const userId = user._id
    bcrypt.compare(password, hash, function (err, result) {
        if (result) {
            var token = jwt.sign({ email, userId }, process.env.SECRET);
            res.send({ messege: "Login Sucessfull", token: token })
        }
        else {
            return res.send("Invalid Credentials");
        }
    });
})

module.exports = userController;