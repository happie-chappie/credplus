import React from "react";
import Button from '@material-ui/core/Button';

import { NetworkErrorMessage } from "./NetworkErrorMessage";

// This is one of the core page, and is shown when the wallet is not connected
export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          <p>Please connect to your wallet.</p>
	  {/*
          <button
            className="btn btn-warning"
            type="button"
            onClick={connectWallet}
          >
          </button>
	  */}
	  <Button variant="contained" color="primary" onClick={connectWallet}>
	    Connect Wallet
	  </Button>
        </div>
      </div>
    </div>
  );
}
