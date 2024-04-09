import { LinearProgress } from "@mui/joy";
import moment from "moment";
import Link from "next/link";
import { campaigns } from "../lib/campaigns";
import { formatStringToUSD } from "../lib/utils";

export type ICandidate = {
  id: number;
  name: string;
  votes: number;
  applicationLetter: string;
  votedBy: string[];
};

export type ICampaign = {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "Open" | "Coming Soon" | "Ended";
  prizePool: number;
  startDate: string;
  endDate: string;
  numberOfWinners: number;
  candidates: ICandidate[];
  voters: number;
};

const Campaigns = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
      {campaigns.map((campaign) => (
        <Campaign key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};

const Campaign = ({ campaign }: { campaign: ICampaign }) => {
  const startDate = moment(campaign.startDate, "DD/MM/YYYY").toDate();
  const endDate = moment(campaign.endDate, "DD/MM/YYYY").toDate();
  const now = new Date();

  const total = endDate.getTime() - startDate.getTime();
  const current = now.getTime() - startDate.getTime();
  const progress =
    campaign.status === "Ended"
      ? 100
      : campaign.status === "Coming Soon"
      ? 0.1
      : (current / total) * 100;

  console.log(campaign.title, total, current, progress);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-4 m-4">
      <img
        src={campaign.image}
        alt={campaign.title}
        className="w-full h-64 object-cover object-center rounded-lg"
      />
      <div className="mt-4 w-full">
        <Link href={`/campaign/${campaign.id}`}>
          <h2 className="text-xl font-semibold">{campaign.title}</h2>
        </Link>
        <p className="mt-2 text-gray-600">{campaign.description}</p>
        <p
          className={
            campaign.status === "Open"
              ? "text-green-500"
              : campaign.status === "Ended"
              ? "text-gray-600"
              : "text-gray-600" + " mt-2 font-semibold text-md"
          }
        >
          {campaign.status}
        </p>
        <p className="mt-2 text-gray-600">
          {formatStringToUSD.format(campaign.prizePool)}
        </p>
        <LinearProgress
          determinate
          value={progress}
          color={
            campaign.status === "Open"
              ? "success"
              : campaign.status === "Ended"
              ? "neutral"
              : "warning"
          }
          sx={{
            "--LinearProgress-thickness": "16px",
          }}
        />
      </div>
    </div>
  );
};

export default Campaigns;
