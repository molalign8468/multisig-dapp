import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

const ExistingWallet = () => {
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
        setMultiSigContract(contractAddress, signer);
        setMessage(`✅ Wallet loaded successfully!`);
        navigate("/dashboard");
      } else {
        setMessage("❌ Failed to load wallet. Please check the address.");
      }
    } catch (error) {
      console.error("Loading existing wallet failed:", error);
      setMessage(`⚠️ Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800 px-4 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 animate-fade-in relative z-10">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-indigo-400 drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2.25c-4.97 0-9 3.6-9 8.04 0 4.44 3.73 8.2 8.62 11.38.21.13.47.13.68 0C17.27 18.49 21 14.73 21 10.29c0-4.44-4.03-8.04-9-8.04zm0 10.54a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-3">
          Access Your MultiSig Wallet
        </h1>
        <p className="text-gray-300 text-center text-sm mb-6">
          Securely connect to your existing wallet by entering its contract
          address below.
        </p>

        <label
          htmlFor="contractAddress"
          className="block text-sm text-gray-400 mb-2 font-medium"
        >
          Contract Address
        </label>
        <input
          type="text"
          id="contractAddress"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0xAbc123..."
          className="w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />

        <button
          onClick={handleLoadWallet}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-xl font-semibold text-white shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 ${
            loading
              ? "bg-gray-700 cursor-not-allowed text-gray-400"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500"
          }`}
        >
          {loading ? "Loading..." : "Load Wallet"}
        </button>

        {message && (
          <div
            className={`mt-4 text-center text-sm p-3 rounded-lg font-medium ${
              message.startsWith("Error") ||
              message.startsWith("❌") ||
              message.startsWith("⚠️")
                ? "bg-red-900/50 text-red-300 border border-red-700"
                : "bg-green-900/50 text-green-300 border border-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ExistingWallet;
