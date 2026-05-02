import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { careerPaths, skillPaths, companyPaths, type CareerPath } from "../../data/career";

const diffBadge: Record<string, string> = {
  Expert: "bg-red-50 text-red-600 border border-red-200",
  Advanced: "bg-orange-50 text-orange-600 border border-orange-200",
  Intermediate: "bg-blue-50 text-blue-600 border border-blue-200",
  Beginner: "bg-green-50 text-green-600 border border-green-200",
};

function CareerPathView() {
  const [selectedPath, setSelectedPath] = useState<CareerPath>(careerPaths[0]);
  const [openTopic, setOpenTopic] = useState<string | null>("Who Is a React Developer");

  return (
    <div className="flex gap-0 h-full">
      {/* Path selector */}
      <div className="w-52 shrink-0 border-r border-gray-100 p-4 overflow-y-auto">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Career Paths</p>
        {careerPaths.map((path) => (
          <button
            key={path.id}
            onClick={() => setSelectedPath(path)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold mb-1 transition-all ${
              selectedPath.id === path.id
                ? "bg-[#3D65F4] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {path.title}
          </button>
        ))}
      </div>

      {/* Path content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-lg">
        {/* Path header */}
        <div className="border border-[#3D65F4]/30 rounded-xl p-3 mb-5 bg-[#F9FBFF] flex items-center justify-between">
          <span className="text-sm font-bold text-[#182B68]">{selectedPath.title}</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>

        {selectedPath.sections.map((section, si) => (
          <div key={si} className="mb-5">
            <p className="text-xs font-bold text-[#3D65F4] mb-2 px-1">{section.title}</p>
            <div className="space-y-1.5 border-l-2 border-[#3D65F4]/20 pl-4">
              {section.topics.map((topic) => (
                <div key={topic.title}>
                  <button
                    onClick={() => setOpenTopic(openTopic === topic.title ? null : topic.title)}
                    className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#3D65F4]/50 hover:bg-[#F9FBFF] transition-all flex justify-between items-center"
                  >
                    {topic.title}
                    {openTopic === topic.title ? <ChevronUp size={12} className="text-[#3D65F4]" /> : <ChevronDown size={12} className="text-gray-400" />}
                  </button>
                  {openTopic === topic.title && topic.subtopics.length > 0 && (
                    <div className="ml-3 mt-1 space-y-1 border-l-2 border-purple-100 pl-3">
                      {topic.subtopics.map((sub) => (
                        <div key={sub} className="px-3 py-1.5 border border-gray-100 rounded-lg text-xs text-gray-600 hover:border-[#3D65F4]/30 cursor-pointer bg-white">
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillPathsView() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {skillPaths.map((path) => (
          <div key={path.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#3D65F4] hover:shadow-md transition-all cursor-pointer">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffBadge[path.level]}`}>{path.level}</span>
            <h3 className="text-sm font-bold text-[#182B68] mt-2 mb-1">{path.title}</h3>
            <p className="text-xs text-gray-400">{path.modules} modules · {path.duration}</p>
            <button className="mt-3 w-full py-2 rounded-lg bg-[#EEF2FF] text-[#3D65F4] text-xs font-semibold hover:bg-[#3D65F4] hover:text-white transition-colors">
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyPathsView() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {companyPaths.map((company) => (
          <div key={company.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#3D65F4] hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-[#182B68]">{company.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffBadge[company.difficulty]}`}>{company.difficulty}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {company.roles.map((role) => (
                <span key={role} className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{role}</span>
              ))}
            </div>
            <button className="mt-3 w-full py-2 rounded-lg bg-[#EEF2FF] text-[#3D65F4] text-xs font-semibold hover:bg-[#3D65F4] hover:text-white transition-colors">
              Prepare Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CareerPage() {
  const [tab, setTab] = useState<"career" | "skill" | "company">("career");
  const tabs = [
    { id: "career", label: "Career Paths" },
    { id: "skill", label: "Skill Paths" },
    { id: "company", label: "Company Paths" },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 flex gap-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              tab === t.id ? "border-[#3D65F4] text-[#3D65F4]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "career" && <CareerPathView />}
        {tab === "skill" && <SkillPathsView />}
        {tab === "company" && <CompanyPathsView />}
      </div>
    </div>
  );
}
