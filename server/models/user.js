const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    user_id: String,
    name: {
        familyName: String,
        givenName: String
    }
})

const  User = mongoose.model('user', userSchema)
module.exports =  User