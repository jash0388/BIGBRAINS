import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { problems, allTags, type Difficulty } from "../../data/practice";

const diffBadge: Record<Difficulty, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-orange-100 text-orange-700",
  Advanced: "bg-red-100 text-red-700",
  Expert: "bg-purple-100 text-purple-700",
};

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<"practice" | "assessments" | "interview">("practice");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [tagOffset, setTagOffset] = useState(0);
  const visibleTags = allTags.slice(tagOffset, tagOffset + 8);

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag === "All" || p.tags.includes(selectedTag.toLowerCase());
    return matchSearch && matchTag;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 flex gap-6">
        {["practice", "assessments", "interview"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 capitalize ${
              activeTab === t ? "border-[#3D65F4] text-[#3D65F4]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden p-5 gap-5">
        {/* Left: problems */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-extrabold mb-4">
            <span className="text-[#3D65F4]">Search for concepts</span>{" "}
            <span className="text-[#FF6B4A]">to practice</span>
          </h2>

          {/* Search bar */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 focus-within:border-[#3D65F4]">
            <Search size={16} className="text-gray-400" />
            <input
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300"
              placeholder="Search for what you want to practice"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-1 border-l pl-3 border-gray-200">
              <span className="text-xs font-semibold text-gray-500">All Difficulty</span>
              <span className="text-gray-400">▾</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setTagOffset(Math.max(0, tagOffset - 1))} className="p-1 rounded border border-gray-200 hover:border-[#3D65F4]">
              <ChevronLeft size={14} />
            </button>
            <div className="flex gap-1.5 overflow-hidden flex-1">
              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTag === tag ? "bg-[#3D65F4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button onClick={() => setTagOffset(Math.min(allTags.length - 8, tagOffset + 1))} className="p-1 rounded border border-gray-200 hover:border-[#3D65F4]">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Problem list */}
          <div className="space-y-3">
            {filtered.map((problem) => (
              <div key={problem.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3D65F4] hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-[#182B68]">{problem.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffBadge[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{problem.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <button className="text-xs font-semibold text-[#3D65F4] hover:underline flex items-center gap-1">
                    Practice <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Key Metrics */}
        <div className="w-60 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-[#182B68] mb-4">Key Metrics</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "0", label: "Problems Solved", color: "text-[#3D65F4]" },
                { value: "Poor", label: "Avg. Performance", color: "text-green-500" },
                { value: "0", label: "Problems Attempted", color: "text-[#3D65F4]" },
                { value: "0", label: "Problems In Progress", color: "text-[#3D65F4]" },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-xl font-extrabold ${m.color}`}>{m.value}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 rounded-xl p-3 text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="6"/>
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#3D65F4" strokeWidth="6"
                    strokeDasharray="0 176" strokeLinecap="round" strokeDashoffset="44"/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400">0/100</span>
              </div>
              <p className="text-[9px] text-gray-400">Average Test Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
