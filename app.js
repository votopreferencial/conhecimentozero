const express = require('express');
const bodyParser = require('body-parser');
const { initLedger, vote, countVotes, getCandidates } = require('./stvVoting');

const app = express();
app.use(bodyParser.json());

app.post('/init', async (req, res) => {
  try {
    await initLedger();
    res.json({ message: 'Ledger inicializado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/vote', async (req, res) => {
  const { voterId, preferences } = req.body;
  try {
    await vote(voterId, preferences);
    res.json({ message: 'Voto registrado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/count', async (req, res) => {
  try {
    const result = await countVotes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/candidates', async (req, res) => {
  try {
    const candidates = await getCandidates();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));