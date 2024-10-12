const { connectToNetwork } = require('./network');
const config = require('./config');

async function initLedger() {
  const { contract } = await connectToNetwork();
  await contract.submitTransaction(config.contractMethods.initLedger);
}

async function vote(voterId, preferences) {
  if (!preferences || preferences.length === 0) {
    throw new Error("Lista de preferências não pode estar vazia");
  }
  const { contract } = await connectToNetwork();
  await contract.submitTransaction(config.contractMethods.vote, voterId, JSON.stringify(preferences));
}

async function countVotes() {
  const { contract } = await connectToNetwork();
  const result = await contract.evaluateTransaction(config.contractMethods.countVotes);
  return JSON.parse(result.toString());
}

async function getCandidates() {
  const { contract } = await connectToNetwork();
  const result = await contract.evaluateTransaction(config.contractMethods.getCandidates);
  return JSON.parse(result.toString());
}

module.exports = {
  initLedger,
  vote,
  countVotes,
  getCandidates
};