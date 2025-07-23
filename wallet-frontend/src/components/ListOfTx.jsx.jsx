import React, { useEffect, useState } from "react";
import useStore from "./store";
import { formatEther } from "ethers";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white text-xl font-inter">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-300">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white text-xl p-4 font-inter">
        <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl text-center max-w-lg w-full transform transition-all duration-300 animate-fade-in">
          <p className="text-lg md:text-xl text-gray-300">
            No transactions found for this wallet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 font-inter relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-4xl mx-auto bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl animate-fade-in transform transition-all duration-500 hover:scale-[1.01]">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 drop-shadow-lg leading-tight">
          List of Transactions
        </h1>
        {message && (
          <p
            className={`mb-6 p-3 rounded-md text-center text-sm md:text-base ${
              message.startsWith("Error")
                ? "bg-red-900 text-red-300"
                : "bg-green-900 text-green-300"
            }`}
          >
            {message}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-md border border-gray-600 rounded-lg shadow-lg p-6 flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  Transaction ID: {tx.id}
                </h3>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Destination:</strong>{" "}
                  <span className="font-mono break-all text-gray-200">
                    {tx.destination}
                  </span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Amount (ETH):</strong>{" "}
                  <span className="font-mono text-green-400">{tx.value}</span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Data:</strong>{" "}
                  <span className="font-mono break-all text-gray-200">
                    {tx.data === "0x" ? "None" : tx.data}
                  </span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">
                  <strong>Executed:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      tx.executed ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {tx.executed ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-gray-300 mb-4 text-sm">
                  <strong>Confirmations:</strong> {tx.confirmationsCount} /{" "}
                  {requiredConfirmations}
                </p>
              </div>

              <div className="mt-4 flex flex-col space-y-2">
                {isCurrentOwner && !tx.executed && (
                  <>
                    {tx.isConfirmedByCurrentUser ? (
                      <button
                        onClick={() => handleRevoke(tx.id)}
                        disabled={processingTxId === tx.id}
                        className={`w-full bg-gradient-to-r from-orange-600 to-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform shadow-md uppercase text-sm
                          ${
                            processingTxId === tx.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-orange-700 hover:to-red-800 hover:scale-105"
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
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform shadow-md uppercase text-sm
                          ${
                            processingTxId === tx.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-blue-700 hover:to-indigo-800 hover:scale-105"
                          }`}
                      >
                        {processingTxId === tx.id ? "Confirming..." : "Confirm"}
                      </button>
                    )}
                    {tx.confirmationsCount >= requiredConfirmations && (
                      <button
                        onClick={() => handleExecute(tx.id)}
                        disabled={processingTxId === tx.id}
                        className={`w-full bg-gradient-to-r from-green-600 to-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform shadow-md uppercase text-sm
                          ${
                            processingTxId === tx.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-green-700 hover:to-teal-800 hover:scale-105"
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
                  <p className="text-center text-green-500 font-semibold italic text-sm">
                    Transaction already executed.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        @keyframes blob-alt {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 60px) scale(1.2);
          }
          66% {
            transform: translate(30px, -30px) scale(0.8);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.42, 0, 0.58, 1);
        }

        .animate-blob-alt {
          animation: blob-alt 8s infinite cubic-bezier(0.42, 0, 0.58, 1);
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ListOfTx;
