const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc get all users
// @route GET/users
// @access private
const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({
            message: 'No User Found'
        })
    }
    res.json(users)
})

// @desc create new user
// @route POST/users
// @access private
const createNewUser = asyncHandler(async(req, res) => {
    const {
        username,
        password,
        roles
    } = req.body

    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({
            message: 'All fields are required'
        })
    }

    //check for duplicates
    const duplicate = await User.findOne({
        username
    }).lean().exec();
    if (duplicate) {
        return res.status(409).json({
            message: 'Duplicate Username'
        })
    }

    //hash password
    const hasedPwd = await bcrypt.hash(password, 10) //salt rounds
    const userObject = {
        username,
        "password": hasedPwd,
        roles
    }

    //create and store user
    const user = User.create(userObject)

    if (user) { //created
        res.status(200).json({
            messgae: 'User scessfully created'
        })
    } else {
        res.status(400).json({
            message: 'Invalid User data received'
        })
    }
})

// @desc update user
// @route PATCH/users
// @access private
const updateUser = asyncHandler(async(req, res) => {
    const {
        id,
        username,
        roles,
        active,
        password
    } = req.body

    //confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active != 'boolean') {
        res.status(400).json({
            message: 'All fields are required'
        })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        res.status(400).json({
            message: 'User not Found'
        })
    }
    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
        //Allow updates to the original user
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10) //salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc delete user
// @route DELETE/users
// @access private
const deleteUser = asyncHandler(async(req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID required' })
    }
    const notes = await Note.findOne({ user: id }).lean().exec()
    if (notes) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: ' User not found' })
    }

    const result = await user.deleteOne()

    res.json(`Username ${result.username} with Id ${result._id} deleted`)
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}