import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import type { ICampaign } from "../../components/Campaigns";
import { campaigns } from "../../lib/campaigns";
import { formatStringToUSD } from "../../lib/utils";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const campaign = campaigns.find((c: ICampaign) => `${c.id}` === id);

  useEffect(() => {
    // fetch data with id
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex flex-row justify-between mt-5">
          <h1 className="text-3xl font-semibold">{campaign?.title}</h1>
          {campaign?.status == "Open" ? (
            <div className="flex gap-4">
              <button className="border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg">
                Nominate
              </button>
              <button className="border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg">
                Apply
              </button>
            </div>
          ) : null}
        </div>
        <p>{campaign?.description}</p>
        <div className="grid grid-rows-1 grid-cols-4 my-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">
              {campaign?.candidates.length}
            </h2>
            <p>Candidates</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">{campaign?.voters}</h2>
            <p>Voters</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">
              {campaign?.numberOfWinners}
            </h2>
            <p>Winners</p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">
              {campaign && formatStringToUSD.format(campaign.prizePool)}
            </h2>
            <p>Prize Pool</p>
          </div>
        </div>
        <hr />
        <div className="mt-5">
          <h2 className="text-2xl font-semibold">Candidates</h2>
          <div className="flex flex-row">
            {campaign?.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="w-full flex border border-gray-200 rounded-lg p-4 justify-between text-center"
              >
                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                <div className="flex gap-3">
                  <button className="border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg">
                    View
                  </button>
                  <button className="border border-violet-600 bg-gray-500 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg">
                    Vote
                  </button>
                  <p className="text-lg">{candidate.votedBy.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
