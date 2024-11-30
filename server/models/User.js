
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    apartmentNumber: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
