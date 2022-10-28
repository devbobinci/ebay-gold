import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

type Props = {};

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  return (
    <div>
      <nav>
        <div>
          <button className="connectWalletBtn">Connect you wallet</button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
