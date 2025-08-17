// src/pages/Dashboard/Dashboard.tsx
import { useEffect, useState } from "react";
import QuickStart from "./QuickStart";
import { api, authHeaders } from "../../lib/api";
import type { Platform, UserQuickProfile } from "../../lib/types";

type SmartItem = {
  title: string;
  url: string;
  platform: Platform | "EdX" | "Skillshare" | "Udacity" | string;
};

const PAGE_SIZE = 12;

export default function Dashboard() {
  const [profile, setProfile] = useState<UserQuickProfile | null>(() => {
    const raw = localStorage.getItem("cc_profile");
    return raw ? (JSON.parse(raw) as UserQuickProfile) : null;
  });

  const [items, setItems] = useState<SmartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<
    "All" | Platform | "EdX" | "Skillshare" | "Udacity"
  >("All");
  const [page, setPage] = useState(1);

  const filtered = items.filter((it) =>
    platformFilter === "All" ? true : it.platform === platformFilter
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function onQuickStartComplete(p: UserQuickProfile) {
    localStorage.setItem("cc_profile", JSON.stringify(p));
    setPage(1);
    setProfile(p);
  }

  useEffect(() => {
    if (!profile) return;
    fetchSmart(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function fetchSmart(p: UserQuickProfile) {
    try {
      setLoading(true);
      const { data } = await api.post(
        "/smart-search",
        {
          skills: p.skills,
          interests: p.interests,
          industry: p.industry,
          limit: 36,
        },
        { headers: authHeaders() }
      );
      setItems(data.items || []);
      setPage(1);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return (
      <main className="cc-container py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuickStart onComplete={onQuickStartComplete} />
          </div>

          <div className="cc-card p-6">
            <h2 className="font-mont font-semibold text-2xl">Full Assessment</h2>
            <p className="text-gray-600 mt-2">
              Aptitude, skills, and MBTI tests with AI analysis.
            </p>
            <div className="mt-4">
              <button className="cc-btn-ghost cursor-not-allowed opacity-60">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cc-container py-10">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile */}
        <section className="cc-card p-5 lg:col-span-1">
          <h3 className="font-mont font-semibold text-xl">Your Profile</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div><div className="font-semibold">Name</div><div className="text-gray-700">{profile.name}</div></div>
            <div><div className="font-semibold">Education</div><div className="text-gray-700">{profile.education}</div></div>
            <div><div className="font-semibold">Primary Industry</div><div className="text-gray-700">{profile.industry}</div></div>
            <div>
              <div className="font-semibold">Skills</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.skills.length ? profile.skills.map((s, i) => <span key={s+i} className="px-2 py-1 rounded bg-cc-100 text-cc-800">{s}</span>) : <span className="text-gray-500">No skills added</span>}
              </div>
            </div>
            <div>
              <div className="font-semibold">Interests</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.interests.length ? profile.interests.map((t, i) => <span key={t+i} className="px-2 py-1 rounded bg-cc-100 text-cc-800">{t}</span>) : <span className="text-gray-500">No interests added</span>}
              </div>
            </div>
            <div className="pt-2">
              <button
                className="cc-btn-ghost"
                onClick={() => {
                  localStorage.removeItem("cc_profile");
                  setItems([]);
                  setPage(1);
                  setProfile(null);
                }}
              >
                Edit Quick Start
              </button>
            </div>
          </div>
        </section>

        {/* Smart Search results */}
        <section className="cc-card p-5 lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="font-mont font-semibold text-xl">Courses & Videos</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Platform:</span>
              <select
  className="rounded-lg border border-gray-300 h-10 px-3 outline-none focus:ring-2 focus:ring-cc-300"
  value={platformFilter}
  onChange={(e) =>
    setPlatformFilter(
      e.target.value as "All" | "Coursera" | "Udemy" | "Skillshare" | "Udacity"
    )
  }
>
  <option>All</option>
  <option>Coursera</option>
  <option>Udemy</option>
  <option>Skillshare</option>
  <option>Udacity</option>
</select>

              <button className="cc-btn-ghost" onClick={() => fetchSmart(profile)}>
                Refresh
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-1">
            Top links found using your skills, interests, and industry. Click any card to open in a new tab.
          </p>

          {loading ? (
            <div className="mt-6 text-gray-600">Finding top results…</div>
          ) : visible.length ? (
            <>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map((it, idx) => (
                  <a
                    key={it.url + idx}
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-gray-100 hover:border-cc-200 hover:shadow-card p-4 transition block"
                  >
                    <div className="text-xs text-gray-500">{it.platform}</div>
                    <div className="font-semibold mt-1 line-clamp-2">{it.title || it.url}</div>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filtered.length ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
                </div>
                <div className="flex items-center gap-2">
                  <button className="cc-btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    ← Prev
                  </button>
                  <span className="text-sm">{page} / {totalPages}</span>
                  <button className="cc-btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    Next →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 text-gray-600">No results found right now. Try Refresh or adjust your skills/interests.</div>
          )}
        </section>

        {/* Coming Soon */}
        <section className="cc-card p-5 lg:col-span-2">
          <h3 className="font-mont font-semibold text-xl">Roadmap</h3>
          <p className="text-gray-600 mt-2">Personalized roadmap generation with milestones and timelines.</p>
          <div className="mt-4"><button className="cc-btn-ghost cursor-not-allowed opacity-60">Coming soon</button></div>
        </section>

        <section className="cc-card p-5 lg:col-span-2">
          <h3 className="font-mont font-semibold text-xl">Mentor Match</h3>
          <p className="text-gray-600 mt-2">Match with industry mentors for tailored guidance.</p>
          <div className="mt-4"><button className="cc-btn-ghost cursor-not-allowed opacity-60">Coming soon</button></div>
        </section>
      </div>
    </main>
  );
}
