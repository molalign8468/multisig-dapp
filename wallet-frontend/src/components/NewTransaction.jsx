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
      setMessage("✅ Transaction created successfully!");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      <svg
        className="absolute top-10 left-10 w-48 h-48 opacity-20 text-purple-600 animate-pulse"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0L24 22H0L12 0Z" />
      </svg>
      <svg
        className="absolute bottom-10 right-10 w-56 h-56 opacity-20 text-pink-600 animate-bounce-slow"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>

      <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
          🚀 Create Transaction
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Propose a new <span className="text-purple-400">Multi-Signature</span>{" "}
          transaction for owner approvals.
        </p>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="nameOfTx"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Transaction Name
            </label>
            <input
              type="text"
              id="nameOfTx"
              value={nameOfTx}
              onChange={(e) => setNameOfTx(e.target.value)}
              placeholder="e.g., Pay Rent"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="destinationAddress"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Destination Address
            </label>
            <input
              type="text"
              id="destinationAddress"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="0xRecipient..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="amountEth"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Amount (ETH)
            </label>
            <input
              type="text"
              id="amountEth"
              value={amountEth}
              onChange={(e) => setAmountEth(e.target.value)}
              placeholder="e.g., 0.5"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="data"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Data (optional, hex string)
            </label>
            <input
              type="text"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          onClick={handleCreateTx}
          disabled={loading}
          className={`mt-7 w-full py-3 px-4 rounded-lg font-bold text-lg tracking-wide transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 shadow-xl ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          }`}
        >
          {loading ? "⏳ Creating..." : "✅ Create Transaction"}
        </button>

        {message && (
          <p
            className={`mt-5 text-center font-medium p-3 rounded-lg ${
              message.startsWith("Error")
                ? "bg-red-900/70 text-red-300"
                : "bg-green-900/70 text-green-300"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <style jsx>{`
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
        .animate-fade-in {
          animation: fadeIn 0.9s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce 6s infinite;
        }
      `}</style>
    </div>
  );
};

export default NewTransaction;
