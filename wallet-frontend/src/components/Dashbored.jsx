import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";

function Dashboard() {
  const navigate = useNavigate();
  const contractAddress = useStore((state) => state.contractAddress);
  const multiSigContract = useStore((state) => state.multiSigContract);
  const fetchContractDetails = useStore((state) => state.fetchContractDetails);
  const account = useStore((state) => state.account);
  const owners = useStore((state) => state.owners);
  const requiredConfirmations = useStore(
    (state) => state.requiredConfirmations
  );
  const transactionCount = useStore((state) => state.transactionCount);
  const clearWalletConnection = useStore(
    (state) => state.clearWalletConnection
  );

  useEffect(() => {
    if (multiSigContract) {
      fetchContractDetails();
    } else {
      // If no contract is loaded, redirect to home
      navigate("/");
    }
  }, [multiSigContract, fetchContractDetails, navigate]);

  if (!multiSigContract) {
    return <div>Loading dashboard... or redirecting to home.</div>;
  }

  const handleLogout = () => {
    clearWalletConnection();
    navigate("/");
  };

  return (
    <div>
      <h1>MultiSig Wallet Dashboard</h1>
      <p>
        <strong>Contract Address:</strong> {contractAddress}
      </p>
      <p>
        <strong>Your Connected Account:</strong> {account}
      </p>
      <p>
        <strong>Owners:</strong> {owners.join(", ")}
      </p>
      <p>
        <strong>Required Confirmations:</strong> {requiredConfirmations}
      </p>
      <p>
        <strong>Total Transactions:</strong> {transactionCount}
      </p>

      <div>
        <button onClick={() => navigate("/list-transactions")}>
          List of Transactions
        </button>
        <button onClick={() => navigate("/new-transaction")}>New Tx</button>
      </div>
      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
