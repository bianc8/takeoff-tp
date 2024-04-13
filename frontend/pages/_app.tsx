import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { SmartAccountProvider } from "../hooks/SmartAccountContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/inter";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>TakeOff by TalentProtocol</title>
        <meta name="description" content="TakeOff by TalentProtocol" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: [
              "email",
              "linkedin",
              "farcaster",
              "github",
              "wallet",
            ],
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
            },
            embeddedWallets: {
              createOnLogin: "all-users",
              noPromptOnSignature: true,
            },
            defaultChain: baseSepolia,
          }}
        >
          <SmartAccountProvider>
            <ToastContainer position="top-right" />
            <Component {...pageProps} />
          </SmartAccountProvider>
        </PrivyProvider>
      </LocalizationProvider>
    </>
  );
}

export default MyApp;
