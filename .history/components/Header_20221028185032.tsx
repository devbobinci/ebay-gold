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
        <div>
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetamask} className="connectWalletBtn">
              Connect you wallet
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
