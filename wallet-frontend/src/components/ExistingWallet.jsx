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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 text-white font-inter relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-alt"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.02] animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 drop-shadow-lg leading-tight">
          Log in to Existing MultiSig Wallet
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-8 text-center leading-relaxed">
          Enter the contract address of an existing MultiSig Wallet to access
          its dashboard and manage your assets.
        </p>
        <div className="mb-6">
          <label
            htmlFor="contractAddress"
            className="block text-gray-300 text-sm font-bold mb-2 text-left"
          >
            Contract Address:
          </label>
          <input
            type="text"
            id="contractAddress"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="e.g., 0xAbc123..."
            className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
          />
        </div>
        <button
          onClick={handleLoadWallet}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-70 shadow-lg tracking-wide uppercase ${
            loading
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white"
          }`}
        >
          {loading ? "Loading Wallet..." : "Load Wallet"}
        </button>
        {message && (
          <p
            className={`mt-4 text-center text-sm md:text-base p-2 rounded-md ${
              message.startsWith("Error")
                ? "bg-red-900 text-red-300"
                : "bg-green-900 text-green-300"
            }`}
          >
            {message}
          </p>
        )}
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

export default ExistingWallet;
