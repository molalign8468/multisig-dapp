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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center px-6 py-10 text-white font-inter relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
      <div className="absolute bottom-10 -right-10 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-6xl bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg leading-tight">
              MultiSig Wallet DApp
            </h1>

            <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed">
              A secure, decentralized way to manage your digital assets with
              <span className="text-purple-400 font-semibold">
                {" "}
                multi-signature approvals
              </span>
              . Connect your wallet to deploy a new MultiSig wallet or access an
              existing one.
            </p>

            {!isConnected ? (
              <button
                onClick={handleConnectWallet}
                className="w-full md:w-auto md:min-w-[240px] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/70 shadow-lg tracking-wide uppercase text-sm md:text-base"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-6">
                <p className="text-base md:text-lg text-green-400 font-medium p-3 bg-gray-700/80 rounded-lg shadow-inner flex items-center justify-between">
                  Connected:
                  <span className="font-mono bg-gray-600 px-3 py-1 rounded-md break-all text-gray-200 text-sm md:text-base ml-2">
                    {account.substring(0, 5) +
                      "..." +
                      account.substring(account.length - 5)}
                  </span>
                </p>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <button
                    onClick={() => navigate("/deploy-new-wallet")}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/70 shadow-lg tracking-wide uppercase text-sm md:text-base"
                  >
                    Deploy New Wallet
                  </button>
                  <button
                    onClick={() => navigate("/existing-wallet")}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/70 shadow-lg tracking-wide uppercase text-sm md:text-base"
                  >
                    Access Existing Wallet
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-gray-900/60 to-gray-800/40 border-l border-gray-700">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,.5),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,.4),transparent_50%)]" />
            <div className="p-10">
              <svg
                viewBox="0 0 560 420"
                role="img"
                aria-labelledby="multiSigTitle"
                className="w-full max-w-[460px] drop-shadow-xl animate-float"
              >
                <title id="multiSigTitle">
                  Multi-Signature Security Illustration
                </title>

                <defs>
                  <filter
                    id="softGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="gradA" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="gradB" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                <g filter="url(#softGlow)">
                  <path
                    d="M280 85c60 22 102 17 140 5 4 119-40 202-140 245-100-43-144-126-140-245 38 12 80 17 140-5z"
                    fill="url(#gradA)"
                    opacity="0.15"
                  />
                  <path
                    d="M280 100c54 19 92 15 124 5 3 105-35 180-124 218-89-38-127-113-124-218 32 10 70 14 124-5z"
                    fill="none"
                    stroke="url(#gradA)"
                    strokeWidth="3"
                  />
                </g>

                <g transform="translate(230,150)">
                  <rect
                    x="0"
                    y="40"
                    width="100"
                    height="90"
                    rx="14"
                    fill="rgba(17,24,39,0.9)"
                    stroke="url(#gradB)"
                    strokeWidth="3"
                  />
                  <path
                    d="M25 40v-16c0-20 15-36 35-36s35 16 35 36v16"
                    fill="none"
                    stroke="url(#gradB)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="85" r="10" fill="url(#gradA)" />
                  <rect
                    x="47"
                    y="95"
                    width="6"
                    height="18"
                    rx="3"
                    fill="url(#gradA)"
                  />
                </g>

                <g transform="translate(130,125)">
                  <g transform="translate(0,0)">
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      fill="rgba(99,102,241,0.2)"
                      stroke="#6366f1"
                    />
                    <rect
                      x="16"
                      y="34"
                      width="8"
                      height="22"
                      rx="3"
                      fill="#6366f1"
                    />
                    <path
                      d="M24 46h16M24 54h10"
                      stroke="#6366f1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </g>
                  <g transform="translate(270,0)">
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      fill="rgba(34,211,238,0.2)"
                      stroke="#22d3ee"
                    />
                    <rect
                      x="16"
                      y="34"
                      width="8"
                      height="22"
                      rx="3"
                      fill="#22d3ee"
                    />
                    <path
                      d="M24 46h16M24 54h10"
                      stroke="#22d3ee"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </g>
                </g>

                <g>
                  <g transform="translate(90,290)">
                    <circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="rgba(168,85,247,0.15)"
                      stroke="#a855f7"
                    />
                    <path
                      d="M-12 8c8 4 16 4 24 0"
                      stroke="#a855f7"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="-6" cy="-6" r="3" fill="#a855f7" />
                    <circle cx="6" cy="-6" r="3" fill="#a855f7" />
                  </g>
                  <g transform="translate(470,290)">
                    <circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="rgba(236,72,153,0.15)"
                      stroke="#ec4899"
                    />
                    <path
                      d="M-12 8c8 4 16 4 24 0"
                      stroke="#ec4899"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="-6" cy="-6" r="3" fill="#ec4899" />
                    <circle cx="6" cy="-6" r="3" fill="#ec4899" />
                  </g>
                  <g transform="translate(280,70)">
                    <circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="rgba(99,102,241,0.15)"
                      stroke="#6366f1"
                    />
                    <path
                      d="M-12 8c8 4 16 4 24 0"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="-6" cy="-6" r="3" fill="#6366f1" />
                    <circle cx="6" cy="-6" r="3" fill="#6366f1" />
                  </g>
                </g>

                <g
                  stroke="url(#gradB)"
                  strokeWidth="2.5"
                  strokeDasharray="4 6"
                  opacity="0.9"
                >
                  <path d="M120 290 Q280 230 330 240" fill="none" />
                  <path d="M440 290 Q300 230 230 240" fill="none" />
                  <path d="M280 96 Q280 140 280 170" fill="none" />
                </g>

                <g transform="translate(250,265)">
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="rgba(34,197,94,0.15)"
                    stroke="#22c55e"
                  />
                  <path
                    d="M18 30l8 8 16-18"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <text
                    x="30"
                    y="60"
                    fontSize="10"
                    textAnchor="middle"
                    fill="#22c55e"
                  >
                    2/3
                  </text>
                </g>
              </svg>
            </div>

            <style jsx>{`
              .animate-float {
                animation: floatY 6s ease-in-out infinite;
              }
              @keyframes floatY {
                0%,
                100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-8px);
                }
              }
            `}</style>
          </div>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
