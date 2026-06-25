const mongoose = require("mongoose");

const taskschema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folder',
        requires: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: Date,
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskschema);




