import React, { useEffect, useState } from "react";
import useStore from "./store";

function ListOfTx() {
  const getTransactions = useStore((state) => state.getTransactions);
  const confirmTransaction = useStore((state) => state.confirmTransaction);
  const revokeTransaction = useStore((state) => state.revokeTransaction);
  const account = useStore((state) => state.account);
  const multiSigContract = useStore((state) => state.multiSigContract);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isCurrentOwner, setIsCurrentOwner] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    setMessage("");
    try {
      const txs = await getTransactions();
      setTransactions(txs);
      if (multiSigContract && account) {
        const ownerStatus = await multiSigContract.isOwner(account);
        setIsCurrentOwner(ownerStatus);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setMessage(`Error fetching transactions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [multiSigContract, account]); // Refetch when contract or account changes

  const handleConfirm = async (id) => {
    setMessage("");
    try {
      await confirmTransaction(id);
      setMessage(`Transaction ${id} confirmed successfully!`);
      fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error("Error confirming transaction:", error);
      setMessage(`Error confirming transaction: ${error.message}`);
    }
  };

  const handleRevoke = async (id) => {
    setMessage("");
    try {
      await revokeTransaction(id);
      setMessage(`Transaction ${id} revoked successfully!`);
      fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error("Error revoking transaction:", error);
      setMessage(`Error revoking transaction: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div>No transactions found for this wallet.</div>;
  }

  return (
    <div>
      <h1>List of Transactions</h1>
      {message && <p>{message}</p>}
      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
        >
          <h3>Transaction ID: {tx.id}</h3>
          <p>
            <strong>Destination:</strong> {tx.destination}
          </p>
          <p>
            <strong>Amount (ETH):</strong> {tx.value}
          </p>
          <p>
            <strong>Data:</strong> {tx.data === "0x" ? "None" : tx.data}
          </p>
          <p>
            <strong>Executed:</strong> {tx.executed ? "Yes" : "No"}
          </p>
          <p>
            <strong>Confirmations:</strong> {tx.confirmationsCount}
          </p>
          {isCurrentOwner &&
            !tx.executed &&
            (tx.isConfirmedByCurrentUser ? (
              <button onClick={() => handleRevoke(tx.id)}>Revoke</button>
            ) : (
              <button onClick={() => handleConfirm(tx.id)}>Confirm</button>
            ))}
          {tx.executed && <p>Transaction already executed.</p>}
        </div>
      ))}
    </div>
  );
}

export default ListOfTx;
