"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import { Button, Select, Option, SvgIcon, Input, Typography } from "@mui/joy";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { styled } from "@mui/joy";
import { RefreshCw } from "lucide-react";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const CreateCampaign = () => {
  const [stakedStatus, setStakedStatus] = useState("not-staked");
  const [startDate, setStartDate] = useState(dayjs());
  const [eligibilityRules, setEligibilityRules] = useState([
    { id: 0, inputElement: "", comparer: "", compareValue: "" },
  ]);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.ok) {
      router.push("/campaigns");
    }
  };

  const onStake = async () => {
    // stake 10 USDC
    setStakedStatus("staking");
    setTimeout(() => setStakedStatus("staked"), 2000);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto w-[40%]">
        <h1 className="text-3xl font-semibold my-4">Create Campaign</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label>
            Title
            <Input placeholder="Campaign title" name="title" required />
          </label>
          <label>
            Description
            <Input
              placeholder="Campaign description"
              name="description"
              required
            />
          </label>
          <label>
            Image
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="outlined"
              color="neutral"
              startDecorator={
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </SvgIcon>
              }
            >
              Upload a file
              <VisuallyHiddenInput type="file" name="image" />
            </Button>
          </label>
          <label>
            Number of winners
            <Input
              type="number"
              defaultValue={3}
              name="number-of-winners"
              required
            />
          </label>
          <label>
            Reward mechanism
            <Select
              name="reward-mechanism"
              defaultValue={"quadratic-funding"}
              required
            >
              <Option value="grant">Grant</Option>
              <Option value="quadratic-funding">Quadratic Funding</Option>
              <Option value="perk">Perk</Option>
            </Select>
          </label>
          <label>
            Selection mechanism
            <Select
              name="selection-mechanism"
              defaultValue={"quadratic-voting"}
              required
            >
              <Option value="normal">Normal</Option>
              <Option value="quadratic-voting">Quadratic Voting</Option>
              <Option value="quadratic-funding">Quadratic Funding</Option>
              <Option value="betting">Betting</Option>
            </Select>
          </label>
          <label>
            Start date
            <DateCalendar
              defaultValue={startDate}
              onChange={(newStartDate) => setStartDate(newStartDate)}
              disablePast
            />
          </label>
          <label>
            Nomination period duration (days from start date)
            <Input
              type="number"
              defaultValue={7}
              name="nomination-period-duration"
              required
            />
          </label>
          <label>
            Voting period duration (days after the end of nomination period)
            <Input
              type="number"
              defaultValue={3}
              name="voting-period-duration"
              required
            />
          </label>
          <label>
            Eligibility rules
            {eligibilityRules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  name={`eligibility-rules-input-element-${index}`}
                  placeholder="Talent Passport"
                  required
                />
                <Input
                  name={`eligibility-rules-comparer-${index}`}
                  placeholder=">"
                  className="w-10"
                  required
                />
                <Input
                  name={`eligibility-rules-comparer-value-${index}`}
                  placeholder="20"
                  className="w-20"
                  required
                />
                <button
                  type="button"
                  className="border border-violet-600 text-violet-600 hover:text-white hover:bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1"
                  onClick={() =>
                    setEligibilityRules([
                      ...eligibilityRules,
                      {
                        id: rule.id + 1,
                        inputElement: "",
                        comparer: "",
                        compareValue: "",
                      },
                    ])
                  }
                >
                  +
                </button>
                {index === 0 ? null : (
                  <button
                    type="button"
                    className="border border-violet-600 text-violet-600 hover:text-white hover:bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1"
                    onClick={() =>
                      setEligibilityRules((eligibilityRules) =>
                        eligibilityRules.filter((a) => a.id !== rule.id)
                      )
                    }
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </label>
          <label>
            Stake at least 10 USDC to create campaign
            {stakedStatus === "not-staked" ? (
              <button
                name="stake"
                type="button"
                className="border border-violet-600 text-violet-600 hover:text-white hover:bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1"
                onClick={onStake}
              >
                Stake
              </button>
            ) : stakedStatus === "staking" ? (
              <button
                type="submit"
                className="flex gap-2 align-middle items-center text-center mx-auto border border-violet-600 text-white hover:text-violet-600 hover:bg-white bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1"
                disabled
              >
                <RefreshCw className="animate-spin" /> Staking...
              </button>
            ) : (
              <button
                type="submit"
                className="flex gap-2 align-middle items-center text-center mx-auto border border-violet-600 text-white hover:text-violet-600 hover:bg-white bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1"
              >
                Staked
              </button>
            )}
          </label>

          {stakedStatus === "staked" ? (
            <button
              type="submit"
              className="border border-violet-600 text-white hover:text-violet-600 hover:bg-white bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1"
            >
              Create
            </button>
          ) : (
            <button
              type="submit"
              className="flex gap-2 align-middle items-center text-center mx-auto border border-orange-700 text-white hover:text-orange-700 hover:bg-white bg-orange-700 py-2 px-4 rounded-lg ml-2 my-1"
              disabled
            >
              You have to stake
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
