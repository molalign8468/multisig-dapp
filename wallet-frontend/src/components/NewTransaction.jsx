import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

const NewTransaction = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 text-white font-inter relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-[1.01] animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-lg leading-tight">
          Create New Transaction
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-8 text-center leading-relaxed">
          Initiate a new multi-signature transaction. Fill in the details below
          to propose a new transaction for owner confirmations.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="nameOfTx"
              className="block text-gray-300 text-sm font-bold mb-2 text-left"
            >
              Name of Transaction: (For UI purposes, not on chain)
            </label>
            <input
              type="text"
              id="nameOfTx"
              value={nameOfTx}
              onChange={(e) => setNameOfTx(e.target.value)}
              placeholder="e.g., Pay Rent"
              className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="destinationAddress"
              className="block text-gray-300 text-sm font-bold mb-2 text-left"
            >
              Destination Address:
            </label>
            <input
              type="text"
              id="destinationAddress"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="e.g., 0xRecipientAddress..."
              className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="amountEth"
              className="block text-gray-300 text-sm font-bold mb-2 text-left"
            >
              Amount in ETH:
            </label>
            <input
              type="text"
              id="amountEth"
              value={amountEth}
              onChange={(e) => setAmountEth(e.target.value)}
              placeholder="e.g., 0.5"
              className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="data"
              className="block text-gray-300 text-sm font-bold mb-2 text-left"
            >
              Data (optional, hex string):
            </label>
            <input
              type="text"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="e.g., 0x..."
              className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
            />
          </div>
        </div>

        <button
          onClick={handleCreateTx}
          disabled={loading}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-70 shadow-lg tracking-wide uppercase ${
            loading
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white"
          }`}
        >
          {loading ? "Creating Transaction..." : "Create Transaction"}
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

export default NewTransaction;
