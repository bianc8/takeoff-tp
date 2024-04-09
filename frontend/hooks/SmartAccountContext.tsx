import React, { useState, useEffect, useContext, useMemo } from "react";
import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import {
  Client,
  RpcTransactionRequest,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { baseSepolia } from "viem/chains";
import {
  WalletClientSigner,
  type SmartAccountSigner,
  PublicErc4337Client,
  createPublicErc4337Client,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactory,
} from "@alchemy/aa-accounts";
import {
  BASE_SEPOLIA_ALCHEMY_RPC_URL,
  BASE_SEPOLIA_ENTRYPOINT_ADDRESS,
  BASE_SEPOLIA_PAYMASTER_URL,
  DEFAULT_SEPOLIA_LIGHT_ACCOUNT_FACTORY_ADDRESS,
} from "../lib/constants";
import { populateWithPaymaster, signUserOp } from "../lib/user-operations";

/** Interface returned by custom `useSmartAccount` hook */
interface SmartAccountInterface {
  /** ConnectedWallet representing the user's EOA (embedded wallet) */
  eoa?: ConnectedWallet;
  /** SmartAccountSigner representing the signer for the smart account */
  smartAccountSigner?: SmartAccountSigner;
  /** AlchemyProvider to send RPC requests to/from the smart account */
  smartAccountProvider?: AlchemyProvider;
  /** Smart account address */
  smartAccountAddress?: `0x${string}` | undefined;
  /** Method to send a user operation from a transaction request, with gas sponsored by Base Paymaster */
  sendSponsoredUserOperation: (
    transactionRequest: RpcTransactionRequest
  ) => Promise<`0x${string}`>;
  /** Boolean to indicate whether the smart account state has initialized */
  smartAccountReady: boolean;
}

const SmartAccountContext = React.createContext<SmartAccountInterface>({
  eoa: undefined,
  smartAccountSigner: undefined,
  smartAccountProvider: undefined,
  smartAccountAddress: undefined,
  sendSponsoredUserOperation: () => {
    throw new Error("Not implemented.");
  },
  smartAccountReady: false,
});

export const useSmartAccount = () => {
  return useContext(SmartAccountContext);
};

export const SmartAccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Get a list of all of the wallets (EOAs) the user has connected to your site
  const { wallets } = useWallets();
  // Find the embedded wallet by finding the entry in the list with a `walletClientType` of 'privy'
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  // States to store the smart account and its status
  const [smartAccountReady, setSmartAccountReady] = useState(false);
  const [eoa, setEoa] = useState<ConnectedWallet | undefined>();
  const [smartAccountSigner, setSmartAccountSigner] = useState<
    SmartAccountSigner | undefined
  >();
  const [smartAccountProvider, setSmartAccountProvider] = useState<
    AlchemyProvider | undefined
  >();
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | undefined
  >();

  // Initialize RPC client connected to the Base Sepolia Paymaster. Used to populate
  // `paymasterAndData` field of user operations.
  const paymaster: Client = useMemo(
    () =>
      createPublicClient({
        chain: baseSepolia,
        transport: http(BASE_SEPOLIA_PAYMASTER_URL),
      }),
    []
  );

  // Initialize RPC client connected to Alchemy's Base Sepolia RPC URL. Used to submit
  // signed user operations to the network
  const bundler: PublicErc4337Client = useMemo(
    () =>
      createPublicErc4337Client({
        chain: baseSepolia,
        rpcUrl: `${BASE_SEPOLIA_ALCHEMY_RPC_URL}/${
          process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string
        }`,
      }),
    []
  );

  useEffect(() => {
    // Creates a smart account given a Privy `ConnectedWallet` object representing
    // the  user's EOA.
    const createSmartWallet = async (eoa: ConnectedWallet) => {
      setEoa(eoa);
      // Get an EIP1193 provider and viem WalletClient for the EOA
      const eoaProvider = await eoa.getEthereumProvider();
      const eoaClient = createWalletClient({
        account: eoa.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(eoaProvider),
      });

      // Initialize a SmartAccountSigner from the EOA to authorize actions taken
      // by the smart account
      const signer: SmartAccountSigner = new WalletClientSigner(
        eoaClient,
        "json-rpc"
      );
      setSmartAccountSigner(signer);

      // Initialize an AlchemyProvider connected to the SmartAccountSigner to initialize
      // the user's smart account and connect it to an RPC node
      const provider = new AlchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
        chain: baseSepolia,
        entryPointAddress: BASE_SEPOLIA_ENTRYPOINT_ADDRESS,
      }).connect(
        (rpcClient) =>
          new LightSmartContractAccount({
            entryPointAddress: BASE_SEPOLIA_ENTRYPOINT_ADDRESS,
            chain: rpcClient.chain,
            owner: signer,
            factoryAddress: DEFAULT_SEPOLIA_LIGHT_ACCOUNT_FACTORY_ADDRESS,
            rpcClient,
          })
      );
      setSmartAccountProvider(provider);

      // Store the address as state so we don't need to make async calls
      // later to get it :)
      const address = await provider.getAddress();
      setSmartAccountAddress(address);
      setSmartAccountReady(true);
    };

    if (embeddedWallet) createSmartWallet(embeddedWallet);
  }, [embeddedWallet?.address]);

  const sendSponsoredUserOperation = async (
    transactionRequest: RpcTransactionRequest
  ) => {
    if (
      !smartAccountProvider ||
      !smartAccountProvider ||
      !smartAccountAddress
    ) {
      throw new Error("Smart account has not yet initialized.");
    }

    // (1) Construct a user operation from the transaction request
    const userOp = await smartAccountProvider.buildUserOperationFromTx(
      transactionRequest
    );

    // (2) Populate the user operation with `paymasterAndData` from the Base Sepolia paymaster
    const populatedUserOp = await populateWithPaymaster(userOp, paymaster);
    /* if transaction gives InvalidParamsRpcError: replacement underpriced, use this instead to increase gas fees by 20%
    const populatedUserOp = await populateWithPaymaster(
      {
        ...userOp,
        maxFeePerGas:
          BigInt(userOp.maxFeePerGas ?? BigInt(0)) +
          BigInt(userOp.maxFeePerGas ?? BigInt(0)) / BigInt(5),
        maxPriorityFeePerGas:
          BigInt(userOp.maxPriorityFeePerGas ?? BigInt(0)) +
          BigInt(userOp.maxPriorityFeePerGas ?? BigInt(0)) / BigInt(5),
      },
      paymaster
    );
    */

    // (3) Hash and sign the populated user operation
    const signedUserOp = await signUserOp(
      populatedUserOp,
      smartAccountProvider
    );

    // (5) Submit the signed user operation to the bundler and return its hash
    const userOpHash = await bundler.sendUserOperation(
      signedUserOp,
      BASE_SEPOLIA_ENTRYPOINT_ADDRESS
    );
    return userOpHash;
  };

  return (
    <SmartAccountContext.Provider
      value={{
        smartAccountReady: smartAccountReady,
        smartAccountProvider: smartAccountProvider,
        smartAccountSigner: smartAccountSigner,
        smartAccountAddress: smartAccountAddress,
        sendSponsoredUserOperation: sendSponsoredUserOperation,
        eoa: eoa,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
};
