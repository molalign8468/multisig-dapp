import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

function NewTransaction() {
  const navigate = useNavigate();
  const submitNewTransaction = useStore((state) => state.submitNewTransaction);
  const multiSigContract = useStore((state) => state.multiSigContract);
  const account = useStore((state) => state.account);

  const [nameOfTx, setNameOfTx] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amountEth, setAmountEth] = useState("");
  const [data, setData] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTx = async () => {
    setMessage("");
    setLoading(true);

    if (!ethers.isAddress(destinationAddress)) {
      setMessage("Error: Please enter a valid destination address.");
      setLoading(false);
      return;
    }
    if (isNaN(parseFloat(amountEth)) || parseFloat(amountEth) < 0) {
      setMessage("Error: Please enter a valid positive amount in ETH.");
      setLoading(false);
      return;
    }

    if (multiSigContract && account) {
      const isOwner = await multiSigContract.isOwner(account);
      if (!isOwner) {
        setMessage("Error: Only owners can submit new transactions.");
        setLoading(false);
        return;
      }
    } else {
      setMessage(
        "Error: MultiSig contract not loaded or wallet not connected."
      );
      setLoading(false);
      return;
    }

    try {
      await submitNewTransaction(destinationAddress, amountEth, data);
      setMessage("Transaction created successfully!");
      setNameOfTx("");
      setDestinationAddress("");
      setAmountEth("");
      setData("");
      navigate("/list-transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
      setMessage(`Error creating transaction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Transaction</h1>
      <div>
        <label>
          Name of Transaction: (For UI purposes, not on chain)
          <input
            type="text"
            value={nameOfTx}
            onChange={(e) => setNameOfTx(e.target.value)}
            placeholder="e.g., Pay Rent"
          />
        </label>
      </div>
      <div>
        <label>
          Destination Address:
          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="e.g., 0xRecipientAddress..."
          />
        </label>
      </div>
      <div>
        <label>
          Amount in ETH:
          <input
            type="text"
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            placeholder="e.g., 0.5"
          />
        </label>
      </div>
      <div>
        <label>
          Data (optional, hex string):
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="e.g., 0x..."
          />
        </label>
      </div>
      <button onClick={handleCreateTx} disabled={loading}>
        {loading ? "Creating..." : "Create TX"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default NewTransaction;
