import { useRouter } from "next/router";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import type { ICampaign, ICandidate } from "../../components/Campaign";
import { campaigns } from "../../lib/campaigns";

import { formatStringToUSD } from "../../lib/utils";
import {
  Modal,
  ModalClose,
  Select,
  Option,
  Sheet,
  Textarea,
  Typography,
  Link,
} from "@mui/joy";

const Page = () => {
  const [candidateVotes, setCandidateVotes] = useState<number>(0);
  const [candidate, setCandidate] = useState<ICandidate>();
  const [openVotingModal, setOpenVotingModal] = useState<boolean>(false);
  const [openApplicationModal, setOpenApplicationModal] =
    useState<boolean>(false);
  const [openNominateModal, setOpenNominateModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { id } = router.query;
  const campaign = campaigns.find((c: ICampaign) => `${c.id}` === id);

  const checkVotes = (e: React.FormEvent<HTMLInputElement>, name: string) => {
    // check if user has votes left
    if (parseInt(e.currentTarget.value) <= (candidate?.votes || 0)) {
      // error vote
      setError(
        `You can give at least ${1 + (candidate?.votes || 0)} votes to ${name}`
      );
    } else {
      setError("");
      setCandidateVotes(parseInt(e.currentTarget.value));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex flex-row justify-between mt-5">
          <h1 className="text-3xl font-semibold">{campaign?.title}</h1>
          {campaign?.status == "Open" ? (
            <div className="flex gap-4">
              <button
                className="border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg"
                onClick={() => setOpenNominateModal(true)}
              >
                Nominate
              </button>
              <button
                className="border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg"
                onClick={() => setOpenApplicationModal(true)}
              >
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
          <div className="flex flex-col">
            {campaign?.candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="w-full flex border border-gray-200 rounded-lg p-4 justify-between text-center"
              >
                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                <div className="flex gap-3 text-center items-center align-middle">
                  <button
                    onClick={() => {
                      setCandidateVotes(candidate.votes + 1);
                      setCandidate(candidate);
                      setOpenVotingModal(true);
                    }}
                    className="border border-violet-600 bg-violet-600 text-white hover:text-violet-600 hover:bg-white py-2 px-4 rounded-lg"
                  >
                    Vote
                  </button>
                  <div className="flex flex-col">
                    <p className="text-lg w-20">
                      {campaign.status === "Ended"
                        ? formatStringToUSD.format(candidate.prize)
                        : `${candidate.votes} votes`}
                    </p>
                    <p className="text-md">
                      {campaign.status === "Ended"
                        ? `${parseFloat(
                            parseFloat(
                              `${(candidate.prize / campaign.prizePool) * 100}`
                            ).toFixed(2)
                          )} %`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Voting modal */}
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openVotingModal}
            onClose={() => setOpenVotingModal(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 500,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <ModalClose variant="plain" sx={{ m: 1 }} />
              <Typography
                id="modal-title"
                component="h2"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
              >
                Vote for{" "}
                <Typography
                  style={{
                    fontSize: 20,
                    background:
                      "-webkit-linear-gradient(45deg, #FE6B8B 30%, #53acff 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {candidate?.name}
                </Typography>
              </Typography>
              <Typography
                id="modal-desc"
                textColor="text.tertiary"
                className="min-h-20 border border-gray-200 rounded-lg p-2"
              >
                {candidate?.applicationLetter}
              </Typography>
              <Typography id="modal-desc" textColor="text.tertiary">
                You have{" "}
                <span>
                  <b>XYZ</b>
                </span>{" "}
                votes left
              </Typography>
              <Typography id="modal-desc" textColor="text.tertiary">
                How many votes do you want to give?
                <input
                  type="number"
                  value={candidateVotes}
                  onChange={(e) => checkVotes(e, candidate?.name || "")}
                />
              </Typography>
              <Typography id="modal-desc" color="danger">
                {error}
              </Typography>
              <Typography id="modal-desc">Top up to vote</Typography>
              <div className="flex items-center align-middle text-center">
                <button className="border border-green-700 text-white bg-green-800 hover:bg-green-600 py-2 px-4 rounded-lg my-1">
                  Pay with Crypto
                </button>
                <button
                  id="cbpay-button-container"
                  className="border border-violet-700 text-violet-700 hover:text-white hover:bg-violet-800 rounded-lg ml-2"
                >
                  <img
                    src="/images/cpay-btn.png"
                    alt="pay with card on coinbase pay"
                    width={100}
                  />
                </button>
              </div>
              <button
                className="border border-violet-700 text-violet-700 py-2 px-4 rounded-lg mt-10 my-1 opacity-30"
                disabled
              >
                Vote
              </button>
            </Sheet>
          </Modal>

          {/* Application modal */}
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openApplicationModal}
            onClose={() => setOpenApplicationModal(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                minWidth: 500,
                maxWidth: 700,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <ModalClose variant="plain" sx={{ m: 1 }} />
              <Typography
                id="modal-title"
                component="h2"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
                marginBottom={2}
              >
                Application for{" "}
                <Typography
                  style={{
                    fontSize: 20,
                    background:
                      "-webkit-linear-gradient(45deg, #FE6B8B 30%, #53acff 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {campaign?.title}
                </Typography>
              </Typography>
              <Typography
                component="h3"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
                marginTop={2}
              >
                Why should we consider you?
              </Typography>
              <Textarea
                minRows={2}
                placeholder="Write your application letter..."
                size="lg"
                className="mt-2"
              />
              <Sheet>
                <Link
                  href="/profile?verify=WorldId"
                  className="border border-violet-700 text-violet-700 py-2 px-4 rounded-lg mt-4 mr-2 my-1"
                >
                  Verify with WorldID
                </Link>
                <button
                  className="border border-violet-700 text-violet-700 py-2 px-4 rounded-lg mt-4 my-1 opacity-30"
                  disabled
                >
                  Apply
                </button>
              </Sheet>
            </Sheet>
          </Modal>

          {/* Nominate modal */}
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openNominateModal}
            onClose={() => setOpenNominateModal(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                minWidth: 500,
                maxWidth: 700,
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <ModalClose variant="plain" sx={{ m: 1 }} />
              <Typography
                id="modal-title"
                component="h2"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
                marginBottom={2}
              >
                Nominate your friend for{" "}
                <Typography
                  style={{
                    fontSize: 20,
                    background:
                      "-webkit-linear-gradient(45deg, #FE6B8B 30%, #53acff 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {campaign?.title}
                </Typography>
              </Typography>

              <Select
                placeholder="Nominate one of your friends…"
                size="lg"
                variant="outlined"
                required
              >
                <Option value="friend-1">Friend 1</Option>
                <Option value="friend-2">Friend 2</Option>
                <Option value="friend-3">Friend 3</Option>
              </Select>

              <Typography
                component="h3"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
                marginTop={2}
              >
                Why should we consider your friend?
              </Typography>
              <Textarea
                minRows={2}
                placeholder="Write the application letter for your friend..."
                size="lg"
                className="mt-2"
              />
              <Sheet>
                <Link
                  href="/profile?verify=WorldId"
                  className="border border-violet-700 text-violet-700 py-2 px-4 rounded-lg mt-4 mr-2 my-1"
                >
                  Verify with WorldID
                </Link>
                <button
                  className="border border-violet-700 text-violet-700 py-2 px-4 rounded-lg mt-10 my-1 opacity-30"
                  disabled
                >
                  Apply
                </button>
              </Sheet>
            </Sheet>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Page;
