import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NewWallet from "./components/NewWallet";
import ExistingWallet from "./components/ExistingWallet";
import Dashboard from "./components/Dashbored";
import ListOfTx from "./components/ListOfTx.jsx";
import Header from "./components/partials/Header.jsx";
import NewTransaction from "./components/NewTransaction.jsx";
import Footer from "./components/partials/Footer.jsx";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
        <svg
          className="absolute top-10 left-10 w-32 h-32 text-purple-700 opacity-10 animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
        >
          <path d="M16 10V7a4 4 0 10-8 0v3m12 0h-1.5M5 10h14v10H5V10z" />
        </svg>
        <svg
          className="absolute bottom-16 right-16 w-32 h-32 text-pink-600 opacity-10 animate-pulse delay-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
        >
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6H4v6a2 2 0 002 2z" />
        </svg>

        <Header />

        <main className="flex-grow container mx-auto px-6 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deploy-new-wallet" element={<NewWallet />} />
            <Route path="/existing-wallet" element={<ExistingWallet />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list-transactions" element={<ListOfTx />} />
            <Route path="/new-transaction" element={<NewTransaction />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
