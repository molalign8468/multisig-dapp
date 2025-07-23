import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import { ethers } from "ethers";

const NewWallet = () => {
  const navigate = useNavigate();
  const deployNewWallet = useStore((state) => state.deployNewWallet);
  const setMultiSigContract = useStore((state) => state.setMultiSigContract);
  const signer = useStore((state) => state.signer);

  const [owners, setOwners] = useState(["", ""]);
  const [requiredConfirmations, setRequiredConfirmations] = useState(2);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOwnerChange = (index, value) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
    if (
      message.includes("owner addresses") ||
      message.includes("at least two owners")
    ) {
      setMessage("");
    }
  };

  const addOwnerField = () => {
    setOwners([...owners, ""]);
    setMessage("");
  };

  const removeOwnerField = (index) => {
    if (owners.length > 2) {
      const newOwners = owners.filter((_, i) => i !== index);
      setOwners(newOwners);
      if (requiredConfirmations > newOwners.length) {
        setRequiredConfirmations(newOwners.length);
      }
      setMessage("");
    } else {
      setMessage("Error: A MultiSig wallet must have at least two owners.");
    }
  };

  const handleRequiredConfirmationsChange = (e) => {
    const inputValue = Number(e.target.value);
    const currentOwnersCount = owners.length;
    let newMessage = "";

    if (inputValue < 2) {
      newMessage = "Error: Required confirmations cannot be less than 2.";
    } else if (inputValue > currentOwnersCount) {
      newMessage = `Error: Required confirmations cannot be more than the number of owners (${currentOwnersCount}).`;
    } else {
      newMessage = "";
    }

    setRequiredConfirmations(
      Math.max(2, Math.min(inputValue, currentOwnersCount))
    );
    setMessage(newMessage);
  };

  const handleDeploy = async () => {
    setMessage("");
    setLoading(true);
    const validOwners = owners.filter((addr) => ethers.isAddress(addr));
    if (validOwners.length !== owners.length) {
      setMessage(
        "Error: All owner addresses must be valid Ethereum addresses."
      );
      setLoading(false);
      return;
    }
    if (validOwners.length < 2) {
      setMessage("Error: Please add at least two owners.");
      setLoading(false);
      return;
    }
    if (
      requiredConfirmations < 2 ||
      requiredConfirmations > validOwners.length
    ) {
      setMessage(
        `Error: Required confirmations must be between 2 and ${validOwners.length}.`
      );
      setLoading(false);
      return;
    }

    try {
      const deployedAddress = await deployNewWallet(
        validOwners,
        requiredConfirmations
      );
      setMultiSigContract(deployedAddress, signer);
      setMessage(`Wallet deployed successfully at: ${deployedAddress}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Deployment failed:", error);
      setMessage(`Deployment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 text-white font-inter relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-alt"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-[1.01] animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 drop-shadow-lg leading-tight">
          Deploy New MultiSig Wallet
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-8 text-center leading-relaxed">
          Define the owners and the number of required confirmations for your
          new multi-signature wallet.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-blue-300 text-left">
          Wallet Owners
        </h2>
        <div className="space-y-4 mb-6">
          {owners.map((owner, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Owner Address ${index + 1}`}
                value={owner}
                onChange={(e) => handleOwnerChange(index, e.target.value)}
                className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
              />
              {owners.length > 2 && (
                <button
                  onClick={() => removeOwnerField(index)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-70 shadow-md"
                  title="Remove Owner"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOwnerField}
            className="max-w-xs mx-auto bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-70 shadow-md flex items-center justify-center space-x-2 uppercase text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Add Owner</span>
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="requiredConfirmations"
            className="block text-gray-300 text-sm font-bold mb-2 text-left"
          >
            Required Confirmations:
          </label>
          <input
            type="number"
            id="requiredConfirmations"
            min="2"
            max={owners.length}
            value={requiredConfirmations}
            onChange={handleRequiredConfirmationsChange}
            className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 placeholder-gray-400 transition duration-300"
          />
          <p className="text-sm text-gray-400 mt-1 text-left">
            (Number of owners required to confirm a transaction)
          </p>
        </div>

        <button
          onClick={handleDeploy}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-70 shadow-lg tracking-wide uppercase ${
            loading
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white"
          }`}
        >
          {loading ? "Deploying Wallet..." : "Deploy Wallet"}
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

export default NewWallet;
