import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";

function Home() {
  const navigate = useNavigate();
  const connectWallet = useStore((state) => state.connectWallet);
  const isConnected = useStore((state) => state.isConnected);
  const account = useStore((state) => state.account);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <div>
      <h1>MultiSig Wallet DApp</h1>
      {!isConnected ? (
        <button onClick={handleConnectWallet}>Connect To Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={() => navigate("/deploy-new-wallet")}>
            Deploy New Wallet
          </button>
          <button onClick={() => navigate("/existing-wallet")}>
            Log in in existing Contract Address
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
