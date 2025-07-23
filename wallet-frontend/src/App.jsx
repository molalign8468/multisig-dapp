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
// 0xE93575648b9036FdBb9e7FE9BD39Be17D422881C
const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deploy-new-wallet" element={<NewWallet />} />
          <Route path="/existing-wallet" element={<ExistingWallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list-transactions" element={<ListOfTx />} />
          <Route path="/new-transaction" element={<NewTransaction />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
