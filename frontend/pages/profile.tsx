"use client";
import Link from "next/link";
import { Box, Button, Sheet, Typography } from "@mui/joy";
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
import { useState } from "react";

const Profile = () => {
  const [reloading, setReloading] = useState(false);
  const { smartAccountAddress } = useSmartAccount();

  const handleReload = () => {
    setReloading(true);
    setTimeout(() => setReloading(false), 2000);
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
                    level="body1"
                    textColor="inherit"
                    fontWeight="md"
                  >
                    Builder Score
                  </Typography>
                </div>
                <button
                  type="button"
                  className="flex align-middle items-center bg-violet-600 text-white p-2 rounded-lg"
                  onClick={handleReload}
                >
                  <RefreshCw className={`${reloading ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div>
                <Button>Buy more votes</Button>
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
            level="body1"
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
                    <Typography component="p" level="body1" textColor="inherit">
                      {campaign.description}
                    </Typography>
                    <Typography component="p" level="body1" textColor="inherit">
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
