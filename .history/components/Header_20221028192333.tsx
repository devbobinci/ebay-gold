import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type Props = {};

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto py-2">
      <nav className="flex justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 4) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetamask} className="connectWalletBtn">
              Connect you wallet
            </button>
          )}

          <p className="headerLink">Daily Deals</p>
          <p className="headerLink">Help & Contact</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <p className="headerLink">Ship to</p>
          <p className="headerLink">Sell</p>
          <p className="headerLink">Watchlist</p>

          <Link href="/addItem" className="flex items-center hover:link">
            Add to inventory
            <ChevronDownIcon className="h-4" />
          </Link>

          <BellIcon className="h-6 w-6 hover:link" />
          <ShoppingCartIcon className="h-6 w-6 hover:link" />
        </div>
      </nav>
      <hr className="mt-2" />

      <section>
        <div className="h-16 w-16 sm:w-28 md:44 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="Thirdweb Logo"
              src="https://links.papareact.com/bdb"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p className="text-gray-600 text-sm">Shop by a Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>

        <div>
          <MagnifyingGlassIcon />
          <input type="text" />
        </div>
      </section>
    </div>
  );
}

export default Header;
