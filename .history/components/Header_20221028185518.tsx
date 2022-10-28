import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

type Props = {};

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div>
      <nav>
        <div className="flex items-center space-x-2">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetamask} className="connectWalletBtn">
              Connect you wallet
            </button>
          )}

          <p className="hidden md:inline-flex cursor-pointer">Daily Deals</p>
          <p className="hidden md:inline-flex cursor-pointer">Help & Contact</p>
        </div>
      </nav>
    </div>
  );
}

export default Header;
