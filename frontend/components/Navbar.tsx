"use client";
import Image from "next/image";
import Link from "next/link";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useSmartAccount } from "../hooks/SmartAccountContext";
import { TakeOffUser, useUsers } from "../hooks/users";
import { Button, Input, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { CircleUser } from "lucide-react";

const Navbar = () => {
  const { loginUser, getLoggedinUser, getUser, addUser } = useUsers();
  const profile = getLoggedinUser();

  const [firstLogin, setFirstLogin] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const { ready, authenticated, user, logout } = usePrivy();
  const { smartAccountAddress } = useSmartAccount();
  // const isLoading = !smartAccountAddress || !smartAccountProvider;

  const { login } = useLogin({
    // Navigate the user to the dashboard after logging in
    onComplete: () => {
      const newUser = {
        ...user,
        votes: 10,
        builderScore: 0,
        hasConnectedTalentProtocol: false,
        hasVerifiedWorldID: false,
        partecipated: [],
        nominations: [],
      } as TakeOffUser;
      loginUser(newUser);
      addUser(newUser);
      setFirstLogin(false);
    },
  });

  useEffect(() => {
    if (firstLogin && ready && authenticated) {
      if (user) {
        const existingUser = getUser(user?.wallet?.address || "");
        if (!existingUser) {
          // open modal to ask for community invite code
          setOpenInviteModal(true);
        }
      }
    }
    setFirstLogin(false);
  }, [ready, authenticated, user, user?.wallet?.address]);

  return (
    <nav id="navbar" className="flex w-full items-center justify-around">
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
            <Sheet color="neutral" className="my-2">
              <p className="text-lg font-semibold">{profile?.votes} votes</p>
              <Link
                href="/profile"
                className="flex text-xs text-gray-500 hover:text-violet-600 items-center gap-1"
              >
                <CircleUser width={18} height={18} />
                {smartAccountAddress}
              </Link>
            </Sheet>
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

      {/* Voting modal */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            minWidth: 600,
            maxWidth: 700,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <div id="modal-title">
            <Typography
              component="h2"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
            >
              Hi{" "}
              <Typography
                style={{
                  fontSize: 20,
                  background:
                    "-webkit-linear-gradient(45deg, #FE6B8B 30%, #53acff 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {user?.wallet?.address}
              </Typography>
              !
            </Typography>
          </div>
          <Typography id="modal-desc" textColor="text.tertiary" marginTop={3}>
            You are a <b>new user</b> and you can use an invite code if you are
            part of a{" "}
            <a href="#" className="underline hover:cursor-pointer">
              sponsored community
            </a>
            .
          </Typography>
          <Input size="lg" variant="outlined" placeholder="Invite code" />
          <Button size="lg" sx={{ marginTop: "1.2rem" }}>
            Submit
          </Button>
        </Sheet>
      </Modal>
    </nav>
  );
};

export default Navbar;
