const User = require('../models/User')
const Note = require('../models/Note')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().select('-password').lean()
    if (!notes.length) {
        return res.status(400).json({ message: "No notes found" })
    }
    res.json(notes)
})

const createNote = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { username, 'password': hashedPwd, roles }
    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

const updateNote = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    user.username = username
    user.roles = roles
    user.active = active
    if(password){
        user.password = await bcrypt.hash(password, 10)
    }
     const updatedUser = await user.save()
     res.json({ message: `${updatedUser.username} updated`})
})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body
    if( !id ){
        res.status(400).json({message: "User Id required"})
    }

    const note = await Note.findOne({user: id}).lean().exec()

    if(note){
        res.status(400).json({message: 'User has assigned notes'})
    }

    const user = await User.findById(id)
    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    const result = await user.deleteOne()
    const reply = `User ${result.username} with ID ${result._id} deleted`

    res.json({message: reply})

})

module.exports = { getAllNotes, createNote, updateNote, deleteNote }
