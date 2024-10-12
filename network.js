const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const config = require('./config');

async function connectToNetwork() {
  const ccpPath = path.resolve(config.connectionProfilePath);
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const walletPath = path.join(process.cwd(), config.walletPath);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identity = await wallet.get(config.org1UserId);
  if (!identity) {
    throw new Error(`Identity ${config.org1UserId} not found in wallet`);
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: config.org1UserId,
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork(config.channelName);
  const contract = network.getContract(config.chaincodeName);

  return { gateway, contract };
}

module.exports = { connectToNetwork };