import type { ICampaign } from "../components/Campaigns";

export const campaigns: ICampaign[] = [
  {
    id: 1,
    title: "Campaign 1",
    description: "Description 1",
    image: "/images/example-img.jpeg",
    status: "Open",
    prizePool: 5000,
    startDate: "01/04/2024",
    endDate: "20/04/2024",
    candidates: [
      {
        id: 1,
        name: "John Doe",
        votes: 10,
        applicationLetter: "Application Letter",
        votedBy: ["Jane Doe", "Alice Doe"],
      },
    ],
    voters: 76,
    numberOfWinners: 3,
  },
  {
    id: 2,
    title: "Campaign 2",
    description: "Description 2",
    image: "/images/example-img.jpeg",
    status: "Coming Soon",
    prizePool: 1500,
    startDate: "01/05/2024",
    endDate: "20/05/2024",
    candidates: [],
    voters: 0,
    numberOfWinners: 10,
  },
  {
    id: 3,
    title: "Campaign 3",
    description: "Description 3",
    image: "/images/example-img.jpeg",
    status: "Ended",
    prizePool: 7500,
    startDate: "01/04/2024",
    endDate: "08/04/2024",
    candidates: [],
    voters: 56,
    numberOfWinners: 7,
  },
  {
    id: 4,
    title: "Campaign 4",
    description: "Description 4",
    image: "/images/example-img.jpeg",
    status: "Ended",
    prizePool: 5000,
    startDate: "01/03/2024",
    endDate: "20/03/2024",
    candidates: [],
    voters: 76,
    numberOfWinners: 3,
  },
];
