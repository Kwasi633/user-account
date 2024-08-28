const uuid = require('uuid')
const HttpError = require('../models/http-error')
const {validationResult } = require('express-validator')
const User = require('../models/user')

//list all users
const getUsers = async (req, res, next) => {
    let users;
    try { users = await User.find({}, '-password');
}
catch(err){
    const error = new HttpError('Fetching users failed, please try again later', 500)
    return next(error)
}
    res.json({ users: users.map(user => user.toObject({ getters: true}))})
}

//signnup with email and password
const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next ( new HttpError('Invalid inputs passed, please check your data', 422)
    )}

    const { password, email } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err){
        const error = new HttpError('Signing up failed, please try again later', 500)
    return next(error)
    }

    if (existingUser){
        const error = new HttpError('User exists already, please login instead', 422)
    
    return next(error)
    }
    
    
    const createdUser = new User({
        email,
        password,
    })

    try{
        await createdUser.save()
    } catch(err) {
        const error = new HttpError('Signing up failed please try again', 500)
    
    return next(error)
}
    
    res.status(201).json({ user: createdUser.toObject({ getters: true}) })
}

//login with email and password
const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err){
        const error = new HttpError('Login failed, please try again later', 500)
    return next(error)
    }

    if (!existingUser || existingUser.password !== password){
        const error = new HttpError('Invalid credentials, login failed', 401)
    
    return next(error)
    }

    res.json({ message: 'Logged In'})
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;