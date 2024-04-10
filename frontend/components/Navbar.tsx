"use client";
import Image from "next/image";
import Link from "next/link";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { useSmartAccount } from "../hooks/SmartAccountContext";
import { BASE_SEPOLIA_SCAN_URL } from "../lib/constants";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const { ready, authenticated, user, logout } = usePrivy();
  const { smartAccountAddress } = useSmartAccount();
  // const isLoading = !smartAccountAddress || !smartAccountProvider;

  const { login } = useLogin({
    // Navigate the user to the dashboard after logging in
    onComplete: () => setLoggedIn(true),
  });

  return (
    <nav
      id="navbar"
      className="flex w-full bg-talent-light-blue items-center justify-around"
    >
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="talent protocol logo"
          className=""
          width={200}
          height={150}
        />
      </Link>
      <div className="flex gap-4 text-center items-center align-middle">
        {authenticated ? (
          <>
            <a
              className="mt-2 text-sm text-gray-500 hover:text-violet-600"
              href={`${BASE_SEPOLIA_SCAN_URL}/address/${smartAccountAddress}#tokentxnsErc721`}
              target="_blank"
            >
              {smartAccountAddress}
            </a>
            <button
              className="border border-violet-600 hover:text-violet-600 text-white bg-violet-700 hover:bg-white py-2 px-4 rounded-lg my-1"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="border border-violet-600 text-violet-600 hover:text-white hover:bg-violet-700 py-2 px-4 rounded-lg my-1"
            onClick={login}
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
