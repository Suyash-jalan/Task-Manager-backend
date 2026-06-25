const mongoose = require("mongoose");

const folderschema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#3b82f6'
    },

}, { timestamps: true });
module.exports = mongoose.model('Folder', folderschema);
