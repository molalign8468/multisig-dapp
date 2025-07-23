import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

const Dashboard = () => {
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
  const contractBalance = useStore((state) => state.contractBalance);
  const clearWalletConnection = useStore(
    (state) => state.clearWalletConnection
  );

  useEffect(() => {
    if (multiSigContract) {
      fetchContractDetails();
    } else {
      navigate("/");
    }
  }, [multiSigContract, fetchContractDetails, navigate]);

  const handleLogout = () => {
    clearWalletConnection();
    navigate("/");
  };

  if (!multiSigContract) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-4">
          Loading dashboard... Please wait or connect wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 flex flex-col items-center">
      <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-2xl mt-10 transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center drop-shadow-lg">
          MultiSig Wallet Dashboard
        </h1>

        <div className="space-y-4 mb-8 text-lg">
          <p className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-inner">
            <strong className="text-blue-300 mr-2">Contract Address:</strong>{" "}
            <span className="font-mono text-sm break-all text-gray-200">
              {contractAddress}
            </span>
          </p>
          <p className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-inner">
            <strong className="text-blue-300 mr-2">Wallet Balance:</strong>{" "}
            <span className="font-mono text-sm text-green-400">
              {contractBalance} ETH
            </span>
          </p>
          <p className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-inner">
            <strong className="text-blue-300 mr-2">
              Your Connected Account:
            </strong>{" "}
            <span className="font-mono text-sm break-all text-gray-200">
              {account.substring(0, 5) +
                "..." +
                account.substring(account.length - 5)}
            </span>
          </p>
          <p className="p-3 bg-gray-700 rounded-lg shadow-inner">
            <strong className="text-blue-300 block mb-2">Owners:</strong>{" "}
            <span className="break-words text-sm text-gray-200">
              {owners.length > 0
                ? owners.map((owner, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-1"
                    >
                      {owner.substring(0, 6)}...
                      {owner.substring(owner.length - 4)}
                    </span>
                  ))
                : "Loading owners..."}
            </span>
          </p>
          <p className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-inner">
            <strong className="text-blue-300 mr-2">
              Required Confirmations:
            </strong>{" "}
            <span className="text-sm text-gray-200">
              {requiredConfirmations}
            </span>
          </p>
          <p className="flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-inner">
            <strong className="text-blue-300 mr-2">Total Transactions:</strong>{" "}
            <span className="text-sm text-gray-200">{transactionCount}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={() => navigate("/list-transactions")}
            className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 shadow-lg"
          >
            <span className="block text-center">View Transactions</span>
          </button>
          <button
            onClick={() => navigate("/new-transaction")}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 shadow-lg"
          >
            <span className="block text-center">Create New Transaction</span>
          </button>
        </div>

        <hr className="border-gray-700 my-6" />

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
