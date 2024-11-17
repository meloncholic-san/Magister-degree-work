//server/models/Message.js
// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     text: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model('Message', messageSchema);


//server/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        apartment: { type: String, required: true },
    },
});

module.exports = mongoose.model('Message', messageSchema);
