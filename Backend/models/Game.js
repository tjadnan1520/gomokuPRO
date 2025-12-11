const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema(
  {
    player1: {
      type: String,
      required: true,
      trim: true
    },
    player2: {
      type: String,
      required: true,
      trim: true
    },
    mode: {
      type: String,
      enum: ['human', 'ai'],
      required: true
    },
    winner: {
      type: String,
      required: true
    },
    totalMoves: {
      type: Number,
      required: true,
      default: 0
    },
    boardState: {
      type: Array,
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', GameSchema);
