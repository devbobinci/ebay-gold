import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  useContract,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  MediaRenderer,
  useAddress,
  useListing,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

function ListingPage() {
  const router = useRouter();
  const address = useAddress();
  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState("");
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  //   const notify = () => toast("Here is your toast.");
  //   notify();

  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { mutate: makeBid } = useMakeBid(contract);

  const { data: offers } = useOffers(contract, listingId);

  const { mutate: makeOffer } = useMakeOffer(contract);

  const { mutate: buyNow } = useBuyNow(contract);

  const { data: listing, isLoading, error } = useListing(contract, listingId);

  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  const fetchMinNextBid = async () => {
    if (!listing || !contract) return;

    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    );

    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceHolder = () => {
    if (!listing) return;

    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }

    if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
    }
  };

  //

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!listingId || !contract || !listing) return;

    toast.loading("Buying NFT...");

    await buyNow(
      {
        id: listingId,
        buyAmount: 1,
        type: listing.type,
      },
      {
        onSuccess(data, variables, context) {
          toast.dismiss();
          toast.success("NFT has been bought");
          console.log("SUCCESS", data, variables, context);
          setTimeout(() => {
            router.replace("/");
          }, 1500);
        },
        onError(error, variables, context) {
          toast.dismiss();
          toast.error("NFT could not be bought");
          console.log("ERROR", error, variables, context);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }

      //Direct Listing

      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT...");
          buyNft();
          return;
        }

        toast.loading("Making an offer...");
        console.log("Buyout price not met, making offer...");
        await makeOffer(
          {
            quantity: 1,
            listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              toast.dismiss();
              toast.success("Offer made successfully");
              console.log("Success", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              toast.dismiss();
              toast.error("Offer not made");
              console.log("Error:", error, variables, context);
            },
          }
        );
      }

      //Auction Listing

      if (listing?.type === ListingType.Auction) {
        toast.loading("Bidding an auction...");
        console.log("Making Bid...");

        await makeBid(
          {
            listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              toast.dismiss();
              toast.success("Bid made successfully");
              console.log("Success", data, variables, context);
            },
            onError(error, variables, context) {
              toast.dismiss();
              toast.error("Bid not made");
              console.log("Error", error, variables, context);
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-green-700">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <Toaster />

        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>

        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-2xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600 py-3">{listing.asset.description}</p>
            <p className="flex items-center text-xs md:tex-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller: </span>
              {listing.sellerAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct Listing"
                : "Auction Listing"}
            </p>
            <p className="font-bold">Buy it Now Price</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>

            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-green-700 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Buy Now
            </button>
          </div>

          {/* if Direct, shows offers here */}

          {listing.type === ListingType.Direct && offers && (
            <div className=" grid grid-cols-2 gay-y-2">
              <p className="font-bold">Offers: </p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>

              {offers.map((offer) => {
                return (
                  <>
                    <p className="flex items-center ml-5 text-sm italic">
                      <UserCircleIcon className="h-3 mr-2" />
                      {offer.offerer.slice(0, 5) +
                        "..." +
                        offer.offerer.slice(-5)}
                    </p>
                    <div>
                      <p
                        key={
                          offer.listingId +
                          offer.offeror +
                          offer.totalOfferAmount.toString()
                        }
                        className="text-sm italic"
                      >
                        {ethers.utils.formatEther(offer.totalOfferAmount)}
                        {NATIVE_TOKENS[network].symbol}
                      </p>

                      {listing.sellerAddress === address && (
                        <button
                          onClick={() =>
                            acceptOffer(
                              {
                                listingId,
                                addressOfOfferor: offer.offeror,
                              },
                              {
                                onSuccess(data, variables, context) {
                                  alert("Offer accepted successfully!");
                                  console.log(
                                    "Success",
                                    data,
                                    variables,
                                    context
                                  );
                                  router.replace("/");
                                },
                                onError(error, variables, context) {
                                  alert("Offer cannot be accepted");
                                  console.log(
                                    "Error",
                                    error,
                                    variables,
                                    context
                                  );
                                },
                              }
                            )
                          }
                          className="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer"
                        >
                          Accept Offer
                        </button>
                      )}
                    </div>
                  </>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className="col-span-2" />

            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an Offer"
                : "Bid on this Auction"}
            </p>

            {/* Remaining time on auction goes here... */}

            {listing.type === ListingType.Auction && (
              <>
                <p>Current Minimum Bid:</p>
                <p className="font-bold">
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                </p>

                <p>Time Remaining: </p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}

            <input
              className="border p-2 rounded-lg mr-5 outline-none"
              type="text"
              placeholder={formatPlaceHolder()}
              onChange={(e) => {
                setBidAmount(e.target.value);
              }}
            />
            <button
              onClick={createBidOrOffer}
              className="bg-red-600 text-white font-bold rounded-full w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ListingPage;
