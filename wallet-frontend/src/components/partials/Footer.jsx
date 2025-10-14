import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-lg text-gray-400 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        {/* Branding */}
        <h2 className="text-lg font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          MultiSig DApp
        </h2>

        {/* Info */}
        <p className="text-sm mt-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <p className="text-xs mt-1 text-gray-500">
          Built with ❤️ by{" "}
          <span className="font-medium text-purple-400">Molalign</span> for
          Web3.
        </p>

        {/* Social Links (Optional) */}
        <div className="flex justify-center space-x-4 mt-3 text-gray-500">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.35-1.79-1.35-1.79-1.1-.75.08-.73.08-.73 1.22.09 1.87 1.26 1.87 1.26 1.08 1.86 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.24-.12-.3-.54-1.51.12-3.16 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.86.12 3.16.77.85 1.24 1.92 1.24 3.24 0 4.63-2.81 5.65-5.48 5.95.43.37.81 1.1.81 2.23v3.3c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.564-2.005.974-3.127 1.195C18.69 2.691 17.064 2 15.292 2c-3.428 0-6.213 2.907-6.213 6.49 0 .509.053.998.16 1.468-5.162-.27-9.74-2.87-12.806-6.82-.538.98-.84 2.108-.84 3.316 0 2.285 1.148 4.295 2.894 5.472-.857-.03-1.66-.27-2.361-.67v.07c0 3.19 2.17 5.854 5.054 6.46-.528.15-1.082.23-1.654.23-.404 0-.8-.04-1.186-.12.805 2.64 3.14 4.56 5.915 4.62-2.17 1.76-4.9 2.82-7.87 2.82-.51 0-1.01-.03-1.51-.09 2.81 1.84 6.15 2.9 9.74 2.9 11.69 0 18.09-10.14 18.09-18.93 0-.29-.01-.57-.02-.85 1.24-.94 2.32-2.1 3.17-3.44z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
