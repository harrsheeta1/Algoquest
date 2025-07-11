const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

router.post('/save-progress', async (req, res) => {
  try {
    const progress = new Progress(req.body);
    await progress.save();
    res.status(201).json({ message: 'Progress saved!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save progress.' });
  }
});

module.exports = router;
