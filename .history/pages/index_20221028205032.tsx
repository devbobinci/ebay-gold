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
  return (
    <div className="">
      <Header />
    </div>
  );
};

export default Home;
