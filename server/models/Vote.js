//server/models/Vote.js

const mongoose = require('mongoose');


const voteSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  votes: [
      {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          option: { type: String },
      },
  ],
  results: { // Додайте поле results
      type: Map,
      of: Number,
      default: {}
  },
  status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date }, // Поле для времени окончания
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
