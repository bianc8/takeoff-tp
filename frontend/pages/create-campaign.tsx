import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const CreateCampaign = () => {
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

  return (
    <div>
      <Navbar />
      <div className="container mx-auto w-[40%]">
        <h1 className="text-3xl font-semibold my-4">Create Campaign</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label>
            Title
            <input type="text" name="title" required />
          </label>
          <label>
            Description
            <input type="text" name="description" required />
          </label>
          <label>
            Image
            <input type="file" name="image" />
          </label>
          <label>
            Number of winners
            <input type="number" name="numberOfWinners" required />
          </label>
          <label>
            Reward mechanism
            <select name="rewardMechanism" required>
              <option value="grant">Grant</option>
              <option value="quadratic-funding" selected>
                Quadratic Funding
              </option>
              <option value="perk">Perk</option>
            </select>
          </label>
          <label>
            Start date
            <input type="date" name="startDate" required />
          </label>
          <label>
            Nomination period duration (days)
            <input type="number" name="nominationPeriodDuration" required />
          </label>
          <label>
            Voting period duration (days)
            <input type="number" name="votingPeriodDuration" required />
          </label>
          <label>
            Eligibility rules
            {eligibilityRules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  name={`eligibilityRules-inputElement-${index}`}
                  placeholder="Talent Passport"
                  required
                />
                <input
                  type="text"
                  name={`eligibilityRules-comparer-${index}`}
                  placeholder=">"
                  className="w-10"
                  required
                />
                <input
                  type="text"
                  name={`eligibilityRules-compareValue-${index}`}
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
            Stake at least 10 USDC
            <button className="border border-violet-600 text-violet-600 hover:text-white hover:bg-violet-700 py-2 px-4 rounded-lg ml-2 my-1">
              Stake
            </button>
          </label>
          <button
            type="submit"
            className="w-20 border border-violet-600 text-white hover:text-violet-600 bg-violet-700 hover:bg-white py-2 px-4 rounded-lg ml-2 my-1"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
