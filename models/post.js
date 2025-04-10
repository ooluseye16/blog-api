const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: [5, 'Title must be at least 5 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minLength: [10, 'Content must be at least 10 characters'],
    },
    author: {

        type: String,
    },
    image: {
        type: String,
        required: false,
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

postSchema.virtual('id').get(function () {
    return this._id;
});

module.exports = mongoose.model('Post', postSchema);