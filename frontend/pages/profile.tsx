"use client";
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Typography } from "@mui/joy";
import Navbar from "../components/Navbar";
import { useSmartAccount } from "../hooks/SmartAccountContext";
import { BASE_SEPOLIA_SCAN_URL } from "../lib/constants";
import { CircleUser, RefreshCw, SquareArrowOutUpRight } from "lucide-react";
import { profile } from "../lib/profile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import { useSearchParams } from "next/navigation";

const Profile = () => {
  const searchParams = useSearchParams();
  const [startVerification, setStartVerification] = useState(false);

  const [reloading, setReloading] = useState(false);
  const { smartAccountAddress } = useSmartAccount();

  useEffect(() => {
    setStartVerification(searchParams.get("verify") === "WorldId");
  });

  const handleReload = () => {
    setReloading(true);
    setTimeout(() => setReloading(false), 2000);
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log("Success", result);
  };

  const handleVerify = ({
    proof,
    merkle_root,
    nullifier_hash,
    verification_level,
  }: {
    proof: string;
    merkle_root: string;
    nullifier_hash: string;
    verification_level: VerificationLevel;
  }) => {
    console.log(
      "HandleVerify",
      proof,
      merkle_root,
      nullifier_hash,
      verification_level
    );
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto w-[80%]">
        <Typography
          id="modal-title"
          component="h1"
          level="h3"
          textColor="inherit"
          fontWeight="lg"
        >
          Profile
        </Typography>
        <div className="grid grid-rows-1 grid-cols-4 gap-2 my-5">
          <CircleUser width={150} height={150} />
          <div className="col-span-3">
            <Typography
              component="h1"
              level="h3"
              textColor="inherit"
              fontWeight="lg"
            >
              {profile?.name}
            </Typography>
            <Link
              href={`${BASE_SEPOLIA_SCAN_URL}/address/${smartAccountAddress}#tokentxnsErc721`}
              target="_blank"
            >
              <Typography
                className="flex flex-row text-center align-middle items-center gap-1"
                component="h3"
                level="h4"
                textColor="inherit"
                fontWeight="sm"
              >
                {profile?.wallet?.address}
                <SquareArrowOutUpRight width={20} height={20} />
              </Typography>
            </Link>
            <div className="flex align-middle text-center items-center justify-around">
              <div className="flex align-middle text-center items-center gap-2">
                {profile?.builderScore ? (
                  <div className="flex flex-col text-center p-4 border border-gray-400 rounded-lg w-40">
                    <Typography
                      component="h2"
                      level="h4"
                      textColor="inherit"
                      fontWeight="xl"
                    >
                      {profile?.builderScore}
                    </Typography>
                    <Typography
                      component="p"
                      level="body-md"
                      textColor="inherit"
                      fontWeight="md"
                    >
                      Builder Score
                    </Typography>
                  </div>
                ) : (
                  <div className="flex flex-col text-center p-4 border border-gray-400 rounded-lg w-40">
                    <Typography
                      component="h2"
                      level="h4"
                      textColor="inherit"
                      fontWeight="xl"
                    >
                      Connect your{" "}
                      <a
                        href="https://passport.talentprotocol.com/"
                        target="_blank"
                        className="underline text-violet-600"
                      >
                        Talent Passport
                      </a>
                    </Typography>
                  </div>
                )}
                <button
                  type="button"
                  className="flex align-middle items-center bg-violet-600 text-white p-2 rounded-lg"
                  onClick={handleReload}
                >
                  <RefreshCw className={`${reloading ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div className="">
                <div>
                  <Button>Buy more votes</Button>
                </div>
                <div
                  className={`border-4 p-6 ${
                    startVerification
                      ? "animate-pulse border-yellow-500 border-"
                      : "border-white"
                  }`}
                >
                  <IDKitWidget
                    app_id={
                      (process.env.NEXT_PUBLIC_WORLID_APP_ID ||
                        "app_123") as `app_${string}`
                    } // obtained from the Developer Portal
                    action={process.env.NEXT_PUBLIC_WORLID_ACTION || ""} // obtained from the Developer Portal
                    onSuccess={onSuccess} // callback when the modal is closed
                    handleVerify={handleVerify} // callback when the proof is received
                    verification_level={VerificationLevel.Device}
                    autoClose={true}
                  >
                    {({ open }) => (
                      // This is the button that will open the IDKit modal
                      <Button onClick={open}>Verify with World ID</Button>
                    )}
                  </IDKitWidget>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-[7vw] my-5">
          <Typography
            component="h1"
            level="h3"
            textColor="inherit"
            fontWeight="lg"
          >
            Partecipated
          </Typography>
          <Typography
            component="p"
            level="body-md"
            textColor="inherit"
            fontSize={18}
            marginBottom={1}
          >
            All the campaigns that you took part in
          </Typography>
          <div className="">
            <Carousel>
              <CarouselContent>
                {profile?.partecipated.map((campaign, index) => (
                  <CarouselItem
                    className="min-h-[30vh] basis-3/4 border border-gray-100 py-4 px-6 rounded-lg"
                    key={campaign.title + index}
                  >
                    <Typography
                      component="h2"
                      level="h4"
                      textColor="inherit"
                      fontWeight="lg"
                    >
                      {campaign.title}
                    </Typography>
                    <Typography
                      component="p"
                      level="body-md"
                      textColor="inherit"
                    >
                      {campaign.description}
                    </Typography>
                    <Typography
                      component="p"
                      level="body-md"
                      textColor="inherit"
                    >
                      You received this SoulBoundToken!
                    </Typography>
                    <a
                      href="#"
                      className="font-semibold text-violet-600 underline"
                    >
                      {campaign.SBT}
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
