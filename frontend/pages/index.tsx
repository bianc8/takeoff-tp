import Head from "next/head";
import { useRouter } from "next/router";
import { campaigns } from "../lib/campaigns";
import Navbar from "../components/Navbar";
import Campaign from "../components/Campaign";

export default function LoginPage() {
  const router = useRouter();

  const createCampaign = () => {
    router.push("/create-campaign");
  };

  return (
    <>
      <Head>
        <title>Campaigns | TakeOff</title>
      </Head>

      <main className="flex flex-col min-h-screen min-w-full">
        <Navbar />
        <div className="flex flex-col items-center">
          <button
            className="mt-10 border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg my-1"
            onClick={createCampaign}
          >
            Create campaign
          </button>
          <h1 className="text-3xl font-semibold mt-10">Campaigns</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            {campaigns.map((campaign) => (
              <Campaign key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
