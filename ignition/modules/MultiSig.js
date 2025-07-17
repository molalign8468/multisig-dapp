// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MultiSigModule", (m) => {
  const ownerAddresses = [
    "0x93d7Ed6f8E5F29502be36b503c51BF4FEa33Ee71",
    "0x220096128b915210f4d3bDCab941d67B83b70f3D",
    "0x3C44CdDcD9A04bFEf62B548e2F0255476d05fC9e",
  ];
  const requiredConfirmations = 2;

  const MultiSig = m.contract("MultiSig", [
    ownerAddresses,
    requiredConfirmations,
  ]);

  return { MultiSig };
});
