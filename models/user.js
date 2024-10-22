const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
        required: true
    }
});

// Password hashing before saving the user
// userSchema.pre('save', async function(next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 10);
//     }
//     next();
// });

// // Compare password for login
// userSchema.methods.comparePassword = async function(enteredPassword) {
//     const user = this;
//     return await bcrypt.compare(enteredPassword, user.password);
// };

module.exports = mongoose.model('User', userSchema);
