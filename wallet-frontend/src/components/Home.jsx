import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";

const Home = () => {
  const navigate = useNavigate();
  const connectWallet = useStore((state) => state.connectWallet);
  const isConnected = useStore((state) => state.isConnected);
  const account = useStore((state) => state.account);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 text-white font-inter relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-700 p-8 rounded-xl shadow-2xl text-center max-w-lg w-full transform transition-all duration-500 hover:scale-[1.02] animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg leading-tight">
          MultiSig Wallet DApp
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
          Welcome to the MultiSig Wallet Decentralized Application. This
          platform allows you to securely manage your digital assets with
          enhanced security through multi-signature requirements. Connect your
          wallet to get started, deploy a new multi-signature wallet, or log in
          to an existing one.
        </p>

        {!isConnected ? (
          <button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70 shadow-lg tracking-wide uppercase text-sm md:text-base"
          >
            Connect To Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-green-400 font-medium p-3 bg-gray-700 rounded-lg shadow-inner flex items-center justify-between">
              Connected Account:{" "}
              <span className="font-mono bg-gray-600 px-3 py-1 rounded-md break-all text-gray-200 text-sm md:text-base ml-2">
                {account.substring(0, 5) +
                  "..." +
                  account.substring(account.length - 5)}
              </span>
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate("/deploy-new-wallet")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-70 shadow-lg tracking-wide uppercase text-sm md:text-base"
              >
                Deploy New Wallet
              </button>
              <button
                onClick={() => navigate("/existing-wallet")}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-70 shadow-lg tracking-wide uppercase text-sm md:text-base"
              >
                Log in to Existing Contract Address
              </button>
            </div>
          </div>
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

export default Home;
