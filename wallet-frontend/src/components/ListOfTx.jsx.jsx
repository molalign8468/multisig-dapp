import React, { useEffect, useState } from "react";
import useStore from "./store";
import { formatEther } from "ethers";
import { CheckCircle, XCircle, Clock, Play } from "lucide-react";

const ListOfTx = () => {
  const getTransactions = useStore((state) => state.getTransactions);
  const confirmTransaction = useStore((state) => state.confirmTransaction);
  const revokeTransaction = useStore((state) => state.revokeTransaction);
  const executeTransaction = useStore((state) => state.executeTransaction);
  const account = useStore((state) => state.account);
  const multiSigContract = useStore((state) => state.multiSigContract);
  const requiredConfirmations = useStore(
    (state) => state.requiredConfirmations
  );

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isCurrentOwner, setIsCurrentOwner] = useState(false);
  const [processingTxId, setProcessingTxId] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (!multiSigContract) {
        setMessage(
          "Error: MultiSig contract not loaded. Please go to Dashboard first."
        );
        setLoading(false);
        return;
      }
      const txs = await getTransactions();
      const detailedTxs = await Promise.all(
        txs.map(async (tx, index) => {
          let isConfirmedByCurrentUser = false;
          if (account) {
            isConfirmedByCurrentUser = await multiSigContract.confirmations(
              index,
              account
            );
          }
          return {
            ...tx,
            id: index,
            isConfirmedByCurrentUser,
          };
        })
      );
      setTransactions(detailedTxs);

      if (account) {
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
  }, [multiSigContract, account, getTransactions]);

  const handleConfirm = async (id) => {
    setMessage("");
    setProcessingTxId(id);
    try {
      await confirmTransaction(id);
      setMessage(`Transaction ${id} confirmed successfully!`);
      fetchTransactions();
    } catch (error) {
      console.error("Error confirming transaction:", error);
      setMessage(`Error confirming transaction: ${error.message}`);
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleRevoke = async (id) => {
    setMessage("");
    setProcessingTxId(id);
    try {
      await revokeTransaction(id);
      setMessage(`Transaction ${id} revoked successfully!`);
      fetchTransactions();
    } catch (error) {
      console.error("Error revoking transaction:", error);
      setMessage(`Error revoking transaction: ${error.message}`);
    } finally {
      setProcessingTxId(null);
    }
  };

  const handleExecute = async (id) => {
    setMessage("");
    setProcessingTxId(id);
    try {
      await executeTransaction(id);
      setMessage(`Transaction ${id} executed successfully!`);
      fetchTransactions();
    } catch (error) {
      console.error("Error executing transaction:", error);
      setMessage(`Error executing transaction: ${error.message}`);
    } finally {
      setProcessingTxId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
        <div className="animate-spin h-16 w-16 border-4 border-teal-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-300 text-lg">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
        <div className="bg-gray-800/60 border border-gray-700 p-8 rounded-2xl shadow-2xl backdrop-blur-lg text-center max-w-lg animate-fade-in">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg md:text-xl text-gray-300">
            No transactions found for this wallet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-6 py-12 font-inter">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Transactions Dashboard
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center text-sm md:text-base font-medium shadow-md ${
              message.startsWith("Error")
                ? "bg-red-900/60 text-red-300 border border-red-700"
                : "bg-green-900/60 text-green-300 border border-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col justify-between backdrop-blur-md hover:scale-[1.02] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-teal-400">
                    Tx #{tx.id}
                  </h3>
                  {tx.executed ? (
                    <CheckCircle className="text-green-500 h-6 w-6" />
                  ) : (
                    <Clock className="text-yellow-500 h-6 w-6" />
                  )}
                </div>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Destination:</strong>{" "}
                  <span className="font-mono break-all text-gray-200">
                    {tx.destination}
                  </span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Amount:</strong>{" "}
                  <span className="font-mono text-green-400">
                    {tx.value} ETH
                  </span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Data:</strong>{" "}
                  <span className="font-mono break-all text-gray-200">
                    {tx.data === "0x" ? "None" : tx.data}
                  </span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Confirmations:</strong>{" "}
                  <span className="text-blue-400">
                    {tx.confirmationsCount} / {requiredConfirmations}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-col space-y-2">
                {isCurrentOwner && !tx.executed && (
                  <>
                    {tx.isConfirmedByCurrentUser ? (
                      <button
                        onClick={() => handleRevoke(tx.id)}
                        disabled={processingTxId === tx.id}
                        className={`w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-2 rounded-lg transition transform ${
                          processingTxId === tx.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105 shadow-md"
                        }`}
                      >
                        {processingTxId === tx.id
                          ? "Revoking..."
                          : "Revoke Confirmation"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConfirm(tx.id)}
                        disabled={processingTxId === tx.id}
                        className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg transition transform ${
                          processingTxId === tx.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105 shadow-md"
                        }`}
                      >
                        {processingTxId === tx.id ? "Confirming..." : "Confirm"}
                      </button>
                    )}
                    {tx.confirmationsCount >= requiredConfirmations && (
                      <button
                        onClick={() => handleExecute(tx.id)}
                        disabled={processingTxId === tx.id}
                        className={`w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-2 rounded-lg transition transform ${
                          processingTxId === tx.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105 shadow-md"
                        }`}
                      >
                        {processingTxId === tx.id
                          ? "Executing..."
                          : "Execute Transaction"}
                      </button>
                    )}
                  </>
                )}
                {tx.executed && (
                  <p className="text-center text-green-400 font-medium italic text-sm">
                    ✅ Transaction executed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListOfTx;
