import { create } from "zustand";
import { ethers } from "ethers";
import CONTRACT_ABI from "../Contracts/ABI.json";
import CONTRACT_BYTECODE from "../Contracts/ByteCode.json";

const useStore = create((set) => ({
  // Wallet Connection State
  provider: null,
  signer: null,
  account: null,
  isConnected: false,

  // MultiSig Contract State
  multiSigContract: null,
  contractAddress: null,
  owners: [],
  requiredConfirmations: 0,
  transactionCount: 0,
  contractBalance: "0.0",

  // Functions to update state
  connectWallet: async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        set({ provider, signer, account, isConnected: true });
        console.log("Wallet connected:", account);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        set({ isConnected: false });
      }
    } else {
      alert("Please install MetaMask!");
      set({ isConnected: false });
    }
  },

  setMultiSigContract: (contractAddress, signerOrProvider) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signerOrProvider
      );
      set({ multiSigContract: contract, contractAddress });
      console.log("MultiSig contract set:", contractAddress);
    } catch (error) {
      console.error("Error setting MultiSig contract:", error);
      set({ multiSigContract: null, contractAddress: null });
    }
  },

  clearWalletConnection: () => {
    set({
      provider: null,
      signer: null,
      account: null,
      isConnected: false,
      multiSigContract: null,
      contractAddress: null,
    });
    console.log("Wallet connection cleared.");
  },

  // Deploy a new MultiSig Wallet
  deployNewWallet: async (ownerAddresses, requiredConfs) => {
    const { signer } = useStore.getState();
    if (!signer) {
      console.error("No signer available. Please connect your wallet.");
      return;
    }

    try {
      const factory = new ethers.ContractFactory(
        CONTRACT_ABI,
        CONTRACT_BYTECODE,
        signer
      );
      console.log(
        "Deploying contract with owners:",
        ownerAddresses,
        "and required confirmations:",
        requiredConfs
      );
      const contract = await factory.deploy(ownerAddresses, requiredConfs);
      await contract.waitForDeployment();
      const deployedAddress = await contract.getAddress();
      set({ multiSigContract: contract, contractAddress: deployedAddress });
      console.log("MultiSig Wallet deployed at:", deployedAddress);
      return deployedAddress;
    } catch (error) {
      console.error("Error deploying new wallet:", error);
      throw error;
    }
  },

  // Load an existing MultiSig Wallet
  loadExistingWallet: async (address) => {
    const { provider, signer } = useStore.getState();
    if (!provider) {
      console.error("No provider available. Please connect your wallet.");
      return false;
    }
    try {
      // Check if the address is a valid contract address
      const code = await provider.getCode(address);
      if (code === "0x") {
        throw new Error("The provided address is not a contract address.");
      }

      const contract = new ethers.Contract(
        address,
        CONTRACT_ABI,
        signer || provider
      );
      try {
        await contract.getRequired();
        set({ multiSigContract: contract, contractAddress: address });
        console.log("Existing MultiSig Wallet loaded:", address);
        return true; // Indicate success
      } catch (error) {
        console.error(
          "The contract at the given address does not appear to be a MultiSig contract.",
          error
        );
        throw new Error("Invalid MultiSig contract address.");
      }
    } catch (error) {
      console.error("Error loading existing wallet:", error);
      throw error;
    }
  },

  // Fetch contract details
  fetchContractDetails: async () => {
    const { multiSigContract, provider, contractBalance } = useStore.getState();
    if (multiSigContract) {
      try {
        const owners = await multiSigContract.getOwners();
        const requiredConfirmations = await multiSigContract.getRequired();
        const transactionCount = await multiSigContract.getTransactionCount();

        const balanceWei = await provider.getBalance(multiSigContract.target);
        const contractBalance = ethers.formatEther(balanceWei);

        set({
          owners,
          requiredConfirmations: Number(requiredConfirmations),
          transactionCount: Number(transactionCount),
          contractBalance,
        });
        console.log("Contract details fetched:", {
          owners,
          requiredConfirmations: Number(requiredConfirmations),
          transactionCount: Number(transactionCount),
        });
      } catch (error) {
        console.error("Error fetching contract details:", error);
      }
    }
  },

  // Submit a new transaction
  submitNewTransaction: async (destination, amountEth, data) => {
    const { multiSigContract, signer } = useStore.getState();
    if (!multiSigContract || !signer) {
      console.error("MultiSig contract not loaded or wallet not connected.");
      return;
    }
    try {
      const value = ethers.parseEther(amountEth);
      const tx = await multiSigContract
        .connect(signer)
        .submitTransaction(destination, value, data || "0x");
      await tx.wait();
      console.log("Transaction submitted:", tx);
      await useStore.getState().fetchContractDetails();
      return tx;
    } catch (error) {
      console.error("Error submitting new transaction:", error);
      throw error;
    }
  },

  getTransactions: async () => {
    const { multiSigContract } = useStore.getState();
    if (!multiSigContract) {
      console.error("MultiSig contract not loaded.");
      return [];
    }
    try {
      const count = await multiSigContract.getTransactionCount();
      const transactions = [];
      for (let i = 0; i < Number(count); i++) {
        const tx = await multiSigContract.getTransaction(i);
        transactions.push({
          id: i,
          destination: tx.destination,
          value: ethers.formatEther(tx.value),
          data: tx.data,
          executed: tx.executed,
          confirmationsCount: Number(tx.confirmationsCount),
          isConfirmedByCurrentUser: await multiSigContract.confirmations(
            i,
            useStore.getState().account
          ),
        });
      }
      console.log("Fetched transactions:", transactions);
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },

  // Confirm a transaction
  confirmTransaction: async (transactionId) => {
    const { multiSigContract, signer } = useStore.getState();
    if (!multiSigContract || !signer) {
      console.error("MultiSig contract not loaded or wallet not connected.");
      return;
    }
    try {
      const tx = await multiSigContract
        .connect(signer)
        .confirmTransaction(transactionId);
      await tx.wait();
      console.log("Transaction confirmed:", transactionId);
      return tx;
    } catch (error) {
      if (error.info.error.code == 4001) {
        throw new Error("User denied transaction signature");
      }
      console.error(
        "Error confirming transaction Contract Has No Enough Balance:",
        error
      );
      throw new Error("Contract Has No Enough Balance");
    }
  },

  // Revoke a transaction confirmation
  revokeTransaction: async (transactionId) => {
    const { multiSigContract, signer } = useStore.getState();
    if (!multiSigContract || !signer) {
      console.error("MultiSig contract not loaded or wallet not connected.");
      return;
    }
    try {
      const tx = await multiSigContract
        .connect(signer)
        .revokeConfirmation(transactionId);
      await tx.wait();
      console.log("Transaction revoked:", transactionId);
      return tx;
    } catch (error) {
      console.error("Error revoking transaction:", error);
      throw error;
    }
  },
}));

export default useStore;
