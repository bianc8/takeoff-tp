"use client";
import Image from "next/image";
import Link from "next/link";
import { useLogin } from "@privy-io/react-auth";

const Navbar = () => {
  const { login } = useLogin({
    // Navigate the user to the dashboard after logging in
    //onComplete: () => router.push("/dashboard"),
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
      <button
        className="border border-violet-600 text-violet-600 hover:text-white hover:bg-violet-700 py-2 px-4 rounded-lg my-1"
        onClick={login}
      >
        Log in
      </button>
    </nav>
  );
};

export default Navbar;
