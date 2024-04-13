"use client";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { LinearProgress } from "@mui/joy";
import { formatStringToUSD } from "../lib/utils";

export type ICandidate = {
  id: number;
  name: string;
  votes: number;
  applicationLetter: string;
  votedBy: string[];
  prize: number;
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
      : parseFloat(parseFloat(`${(current / total) * 100}`).toFixed(2));

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-4 m-4">
      <Link href={`/campaign/${campaign.id}`}>
        <Image
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-64 object-cover object-center rounded-lg"
          width={500}
          height={300}
        />
      </Link>
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

export default Campaign;
