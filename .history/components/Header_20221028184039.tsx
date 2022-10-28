import React from "react";

type Props = {};

function Header({}: Props) {
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
