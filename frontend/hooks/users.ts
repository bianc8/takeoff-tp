"use client";
import { useEffect, useState } from "react";
import type { User } from "@privy-io/react-auth";

export type TakeOffUser = User & {
  votes: number;
  hasConnectedTalentProtocol: boolean;
  builderScore: number;
  hasVerifiedWorldID: boolean;
  partecipated: {
    title: string;
    description: string;
    SBT: string;
  }[];
  nominations: {
    user: string;
    title: string;
    description: string;
    SBT: string;
  }[];
};

export function useUsers() {
  const [loggedUser, setLoggedUser] = useState<TakeOffUser | null>(null);
  const [users, setUsers] = useState<TakeOffUser[]>([
    // {
    //   id: "did:privy:cluubgr7s0kwad8c25w6q9fdl",
    //   createdAt: new Date("2024-04-10T21:22:38.000Z"),
    //   linkedAccounts: [
    //     {
    //       address: "0x2181015aA6843D4bd8bADCab0541CE0d4F4B83e1",
    //       type: "wallet",
    //       verifiedAt: new Date("2024-04-10T21:22:41.000Z"),
    //       chainType: "ethereum",
    //       chainId: "eip155:1",
    //       walletClient: "privy",
    //       walletClientType: "privy",
    //       connectorType: "embedded",
    //       recoveryMethod: "privy",
    //     },
    //     {
    //       address: "bravbrwsr@gmail.com",
    //       type: "email",
    //       verifiedAt: new Date("2024-04-10T21:22:38.000Z"),
    //     },
    //   ],
    //   email: {
    //     address: "bravbrwsr@gmail.com",
    //   },
    //   wallet: {
    //     address: "0x2181015aA6843D4bd8bADCab0541CE0d4F4B83e1",
    //     chainType: "ethereum",
    //     chainId: "eip155:1",
    //     walletClient: "privy",
    //     walletClientType: "privy",
    //     connectorType: "embedded",
    //   },
    //   mfaMethods: [],
    //   hasAcceptedTerms: false,
    //   votes: 10,
    //   hasConnectedTalentProtocol: true,
    //   builderScore: 60,
    //   hasVerifiedWorldID: false,
    //   partecipated: [],
    //   nominations: [],
    // },
  ]);

  useEffect(() => {
    console.log("users", users, loggedUser);
  }, [users, loggedUser]);

  const loginUser = (user: TakeOffUser) => {
    setLoggedUser(user);
    // write to local storage
    window !== undefined
      ? window?.localStorage.setItem("loggedUser", JSON.stringify(user))
      : null;
  };

  const getLoggedinUser = () => {
    if (loggedUser) return loggedUser;
    // read from local storage
    const user =
      window !== undefined ? window?.localStorage.getItem("loggedUser") : null;
    if (user) {
      const parsedUser = JSON.parse(user);
      setLoggedUser(parsedUser);
      return parsedUser as TakeOffUser;
    }
  };

  const addUser = (user: TakeOffUser) => {
    const exisistingUser = getUser(user?.wallet?.address || "");
    console.log("add user existingUser", exisistingUser);
    if (!exisistingUser) {
      console.log("add non existing user", user);
      setUsers((prev) => [...prev, user]);
    }
  };

  const getUser = (address: string) => {
    return users.find((user) => user?.wallet?.address === address);
  };

  const updateUser = (newUser: TakeOffUser) => {
    const index = users.findIndex(
      (u) => u?.wallet?.address === newUser?.wallet?.address
    );
    console.log("update user at index", index);
    if (index !== -1) {
      setUsers((prev) => {
        const newUsers = [...prev];
        newUsers[index] = newUser;
        return newUsers;
      });
    }
  };

  return { users, loginUser, getLoggedinUser, addUser, getUser, updateUser };
}
