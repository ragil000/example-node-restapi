const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { isEmail } = require('validator')

const accountSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'username harus unik'],
        required: [true, 'username harus diisi']
    },
    email: {
        type: String,
        unique: [true, 'email harus unik'],
        required: [true, 'email harus diisi'],
        validate: [isEmail, 'format email tidak falid']
    },
    password: {
        type: String,
        minLength: [6, 'minimal harus 6 karakter'],
        required: [true, 'password harus diisi']
    }
}, {
    timestamps: true
})

accountSchema.plugin(mongoosePaginate)

const Account = mongoose.model('Account', accountSchema)
Account.paginate().then({})
module.exports = Account