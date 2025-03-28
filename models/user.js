const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,

    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

},
    {
        toJSON: {
            virtuals: true, transform: (doc, ret) => {
                const id = ret._id; // Store the _id value
                delete ret._id; // Remove _id
                delete ret.__v; // Remove __v if you have it.
                ret = { id, ...ret }; // Place id first
                return ret;
            }
        },
        toObject: {
            virtuals: true, transform: (doc, ret) => {
                const id = ret._id; // Store the _id value
                delete ret._id; // Remove _id
                delete ret.__v; // Remove __v if you have it.
                ret = { id, ...ret }; // Place id first
                return ret;
            }
        },
    }
);

userSchema.virtual('id').get(function () {
    return this._id;
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
}
);

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);

}


module.exports = mongoose.model('User', userSchema);