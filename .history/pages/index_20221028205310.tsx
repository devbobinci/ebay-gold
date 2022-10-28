import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";

import Header from "../components/Header";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  console.log(listings);

  return (
    <div className="">
      <Header />

      <main>
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading listings
          </p>
        ) : (
          <div>Listings</div>
        )}
      </main>
    </div>
  );
};

export default Home;
