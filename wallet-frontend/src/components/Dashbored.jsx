import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import {
  FiUsers,
  FiCheckCircle,
  FiRepeat,
  FiLogOut,
  FiFileText,
} from "react-icons/fi";
import { FaWallet, FaEthereum } from "react-icons/fa";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-6 text-lg font-medium opacity-80">
          Loading dashboard... Please wait or connect wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 flex flex-col items-center font-inter">
      <h1 className="text-4xl font-extrabold mt-6 mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
        MultiSig Wallet Dashboard
      </h1>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 bg-opacity-60 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition transform">
          <div className="flex items-center mb-3">
            <FaWallet className="text-purple-400 text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Contract Address</h2>
          </div>
          <p className="font-mono text-sm break-all text-gray-300">
            {contractAddress}
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-60 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition transform">
          <div className="flex items-center mb-3">
            <FaEthereum className="text-green-400 text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Wallet Balance</h2>
          </div>
          <p className="text-green-400 font-bold text-xl">
            {contractBalance} ETH
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-60 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition transform">
          <div className="flex items-center mb-3">
            <FiUsers className="text-blue-400 text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Owners</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {owners.length > 0
              ? owners.map((owner, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-700 px-3 py-1 rounded-full text-xs font-mono text-gray-300"
                  >
                    {owner.substring(0, 6)}...
                    {owner.substring(owner.length - 4)}
                  </span>
                ))
              : "Loading owners..."}
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-60 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition transform">
          <div className="flex items-center mb-3">
            <FiCheckCircle className="text-pink-400 text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Confirmations Required</h2>
          </div>
          <p className="text-gray-300 text-lg">{requiredConfirmations}</p>
        </div>

        <div className="bg-gray-800 bg-opacity-60 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition transform">
          <div className="flex items-center mb-3">
            <FiRepeat className="text-yellow-400 text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Total Transactions</h2>
          </div>
          <p className="text-gray-300 text-lg">{transactionCount}</p>
        </div>

        <div className="bg-gray-800 bg-opacity-60 border border-gray-700 p-6 rounded-2xl shadow-xl backdrop-blur-lg hover:scale-[1.02] transition transform">
          <div className="flex items-center mb-3">
            <FaWallet className="text-indigo-400 text-2xl mr-2" />
            <h2 className="text-lg font-semibold">Your Account</h2>
          </div>
          <p className="font-mono text-sm text-gray-300">
            {account.substring(0, 5)}...{account.substring(account.length - 5)}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-12 w-full max-w-3xl">
        <button
          onClick={() => navigate("/list-transactions")}
          className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <FiFileText className="text-xl" /> View Transactions
        </button>

        <button
          onClick={() => navigate("/new-transaction")}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <FiRepeat className="text-xl" /> Create New Transaction
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-10 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <FiLogOut className="text-xl" /> Logout
      </button>
    </div>
  );
};

export default Dashboard;
