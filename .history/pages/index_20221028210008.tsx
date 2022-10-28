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

      <main className="max-w-6xl mx-auto p-2">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading listings
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <div
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
                key={listing.id}
              >
                <div>
                  <MediaRenderer className="w-44" src={listing.asset.image} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
