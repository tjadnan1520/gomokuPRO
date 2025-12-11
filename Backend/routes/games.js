const express = require('express');
const Game = require('../models/Game');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 }).limit(50);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { player1, player2, mode, winner, totalMoves, boardState } = req.body;

    if (!player1 || !player2 || !mode || !winner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const game = new Game({
      player1,
      player2,
      mode,
      winner,
      totalMoves: totalMoves || 0,
      boardState: boardState || []
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

router.get('/stats/:playerName', async (req, res) => {
  try {
    const playerName = req.params.playerName;
    
    const totalGames = await Game.countDocuments({
      $or: [{ player1: playerName }, { player2: playerName }]
    });

    const wins = await Game.countDocuments({
      winner: playerName
    });

    const losses = totalGames - wins - (await Game.countDocuments({
      $or: [{ player1: playerName }, { player2: playerName }],
      winner: 'draw'
    }));

    const draws = await Game.countDocuments({
      $or: [{ player1: playerName }, { player2: playerName }],
      winner: 'draw'
    });

    res.json({
      playerName,
      totalGames,
      wins,
      losses,
      draws,
      winRate: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;