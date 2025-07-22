import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

function ExistingWallet() {
  const navigate = useNavigate();
  const loadExistingWallet = useStore((state) => state.loadExistingWallet);
  const signer = useStore((state) => state.signer);
  const setMultiSigContract = useStore((state) => state.setMultiSigContract);

  const [contractAddress, setContractAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoadWallet = async () => {
    setMessage("");
    setLoading(true);
    if (!ethers.isAddress(contractAddress)) {
      setMessage("Error: Please enter a valid Ethereum contract address.");
      setLoading(false);
      return;
    }
    try {
      const success = await loadExistingWallet(contractAddress);
      if (success) {
        setMultiSigContract(contractAddress, signer); // Set the contract in the store
        setMessage(`Wallet loaded successfully from: ${contractAddress}`);
        navigate("/dashboard");
      } else {
        setMessage("Failed to load wallet. Please check the address.");
      }
    } catch (error) {
      console.error("Loading existing wallet failed:", error);
      setMessage(`Failed to load wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Log in to Existing MultiSig Wallet</h1>
      <div>
        <label>
          Contract Address:
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Enter existing contract address"
          />
        </label>
      </div>
      <button onClick={handleLoadWallet} disabled={loading}>
        {loading ? "Loading..." : "Load Wallet"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ExistingWallet;
