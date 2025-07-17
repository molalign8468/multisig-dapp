const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MultiSigWallet", function () {
  let MultiSigWallet, multiSigWallet, owner1, owner2, owner3, owner4;

  beforeEach(async function () {
    [owner1, owner2, owner3, owner4] = await ethers.getSigners();
    MultiSigWallet = await ethers.getContractFactory("MultiSig");
    multiSigWallet = await MultiSigWallet.deploy(
      [owner1.address, owner2.address, owner3.address],
      2
    );
  });

  it("should deploy with correct owners and required confirmations", async function () {
    expect(await multiSigWallet.required()).to.equal(2);
    expect(await multiSigWallet.isOwner(owner1.address)).to.be.true;
    expect(await multiSigWallet.isOwner(owner2.address)).to.be.true;
    expect(await multiSigWallet.isOwner(owner4.address)).to.be.false;
  });
});
