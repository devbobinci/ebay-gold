import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";

import Header from "../components/Header";

const Home = () => {
  const { contract } = useContract("");
  return (
    <div className="">
      <Header />
    </div>
  );
};

export default Home;
