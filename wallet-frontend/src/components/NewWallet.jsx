import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

function NewWallet() {
  const navigate = useNavigate();
  const deployNewWallet = useStore((state) => state.deployNewWallet);
  const setMultiSigContract = useStore((state) => state.setMultiSigContract);
  const signer = useStore((state) => state.signer);

  const [owners, setOwners] = useState(["", ""]); // Initial two owner input fields
  const [requiredConfirmations, setRequiredConfirmations] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOwnerChange = (index, value) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const addOwnerField = () => {
    setOwners([...owners, ""]);
  };

  const removeOwnerField = (index) => {
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
    // Adjust required confirmations if it exceeds the new number of owners
    if (requiredConfirmations > newOwners.length && newOwners.length > 0) {
      setRequiredConfirmations(newOwners.length);
    } else if (newOwners.length === 0) {
      setRequiredConfirmations(0);
    }
  };

  const handleDeploy = async () => {
    setMessage("");
    setLoading(true);
    const validOwners = owners.filter((addr) => ethers.isAddress(addr));
    if (validOwners.length !== owners.length) {
      setMessage(
        "Error: All owner addresses must be valid Ethereum addresses."
      );
      setLoading(false);
      return;
    }
    if (validOwners.length === 0) {
      setMessage("Error: Please add at least one owner.");
      setLoading(false);
      return;
    }
    if (
      requiredConfirmations <= 0 ||
      requiredConfirmations > validOwners.length
    ) {
      setMessage(
        `Error: Required confirmations must be between 1 and ${validOwners.length}.`
      );
      setLoading(false);
      return;
    }

    try {
      const deployedAddress = await deployNewWallet(
        validOwners,
        requiredConfirmations
      );
      setMultiSigContract(deployedAddress, signer);
      setMessage(`Wallet deployed successfully at: ${deployedAddress}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Deployment failed:", error);
      setMessage(`Deployment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Deploy New MultiSig Wallet</h1>
      <p>Enter owner addresses and required confirmations.</p>

      {owners.map((owner, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Owner Address ${index + 1}`}
            value={owner}
            onChange={(e) => handleOwnerChange(index, e.target.value)}
          />
          {owners.length > 1 && (
            <button onClick={() => removeOwnerField(index)}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addOwnerField}>+</button>

      <div>
        <label>
          Required Confirmations:
          <input
            type="number"
            min="1"
            max={owners.filter((addr) => ethers.isAddress(addr)).length || 1}
            value={requiredConfirmations}
            onChange={(e) =>
              setRequiredConfirmations(
                Math.max(
                  1,
                  Math.min(
                    Number(e.target.value),
                    owners.filter((addr) => ethers.isAddress(addr)).length || 1
                  )
                )
              )
            }
          />
        </label>
      </div>

      <button onClick={handleDeploy} disabled={loading}>
        {loading ? "Deploying..." : "Deploy Wallet"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default NewWallet;
