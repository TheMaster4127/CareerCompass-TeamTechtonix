// src/pages/Dashboard/QuickStart.tsx
import { useState } from "react";
import PillInput from "../../components/PillInput";
import type { Education, Industry, UserQuickProfile } from "../../lib/types";

const EDUCATIONS: Education[] = [
  "High School",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "PhD",
  "Bootcamp",
  "Self-taught",
  "Working Professional",
  "Career Switch",
  "Other",
];

const INDUSTRIES: Industry[] = [
  "Software Development",
  "Data Science",
  "Cybersecurity",
  "Cloud & DevOps",
  "Product Management",
  "UI/UX Design",
  "Digital Marketing",
  "Business & Entrepreneurship",
  "Game Development",
  "AI & Machine Learning",
];

export default function QuickStart({
  onComplete,
}: {
  onComplete: (profile: UserQuickProfile) => void;
}) {
  const [name, setName] = useState("");
  const [education, setEducation] = useState<Education>("Undergraduate");
  const [industry, setIndustry] = useState<Industry>("Software Development");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  function submit() {
    const profile: UserQuickProfile = {
      name: name.trim() || "Guest",
      education,
      industry,
      skills,
      interests,
    };
    onComplete(profile);
  }

  return (
    <div className="cc-card p-6">
      <h2 className="font-mont font-semibold text-2xl">Quick Start</h2>
      <p className="text-gray-600 mt-1">
        Enter a few details to personalize recommendations. Full assessment is
        coming soon.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Education</label>
          <select
            className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
            value={education}
            onChange={(e) => setEducation(e.target.value as Education)}
          >
            {EDUCATIONS.map((ed) => (
              <option key={ed} value={ed}>
                {ed}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Primary Industry</label>
          <select
            className="w-full rounded-lg border border-gray-300 h-11 px-3 outline-none focus:ring-2 focus:ring-cc-300"
            value={industry}
            onChange={(e) => setIndustry(e.target.value as Industry)}
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <PillInput
            label="Skills"
            values={skills}
            setValues={setSkills}
            placeholder="e.g., Python, SQL, React"
          />
        </div>

        <div className="md:col-span-2">
          <PillInput
            label="Interests"
            values={interests}
            setValues={setInterests}
            placeholder="e.g., Data visualization, Cloud automation"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={submit} className="cc-btn-primary">
          Save and Continue
        </button>
        <a
          href="#"
          className="cc-btn-ghost cursor-not-allowed opacity-60"
          onClick={(e) => e.preventDefault()}
          title="Coming soon"
        >
          Full Assessment (Coming soon)
        </a>
      </div>
    </div>
  );
}
