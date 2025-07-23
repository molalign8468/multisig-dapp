import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-center shadow-inner mt-auto">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} MultiSig DApp. All rights reserved.
        </p>
        <p className="text-sm mt-2">Built By Molalign with ❤️ for Web3.</p>
      </div>
    </footer>
  );
};

export default Footer;
