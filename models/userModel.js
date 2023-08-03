const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'user name required']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'user email required'],
        unique: true,
        lowercase: true,
    },
    phone: String,
    profilePic: String,
    password: {
        type: String,
        required: [true, 'user pasword required'],
        minlength: [6, 'user pasword minimum hould be 6'],
    },
    passwordChangedAt:Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
module.exports = mongoose.model('User', userSchema);