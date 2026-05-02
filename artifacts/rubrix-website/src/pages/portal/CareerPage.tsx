import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, ExternalLink, CheckCircle } from "lucide-react";
import { companyPaths } from "../../data/career";
import { useRubrixData } from "../../hooks/useRubrixData";
import { useAuth } from "../../context/AuthContext";

const diffBadge: Record<string, string> = {
  Expert:       "bg-red-50 text-red-600 border border-red-200",
  Advanced:     "bg-orange-50 text-orange-600 border border-orange-200",
  Intermediate: "bg-blue-50 text-blue-600 border border-blue-200",
  Beginner:     "bg-green-50 text-green-600 border border-green-200",
};

// ─── Real API types ───────────────────────────────────────────────────────────
interface ApiCareerPath {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  careerpath_description?: string;
  prerequisites?: string[];
  modules?: { module_id: string; title: string }[];
}

interface ApiSkillPath {
  _id?: string;
  skill_name: string;
  slug: string;
  description?: string;
  prerequisites?: string[];
  is_active?: boolean;
}

interface ApiCareerProgress {
  career_path_id?: string;
  progress?: number;
}

// ─── Career paths – live ──────────────────────────────────────────────────────
function CareerPathView() {
  const { student } = useAuth();
  const { data, loading } = useRubrixData<ApiCareerPath[]>("python", "/career-paths/", true, { requireAuth: false });

  const paths: ApiCareerPath[] = Array.isArray(data) ? data : [];
  const progress: ApiCareerProgress[] = [];

  // Student's enrolled path count from login session
  const enrolledCount = (student?.myPaths?.career_path_ids || []).length;

  const [selected, setSelected] = useState<ApiCareerPath | null>(null);
  const [openMod, setOpenMod]   = useState<string | null>(null);

  const active = selected || paths[0] || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-2 text-gray-400 text-sm">
        <Loader2 size={18} className="animate-spin text-[#3D65F4]" /> Loading career paths…
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Path list — vertical sidebar on desktop, horizontal chips on mobile */}
      <div className="md:w-52 shrink-0 md:border-r border-gray-100 md:p-4 md:overflow-y-auto">
        {/* Mobile: horizontal scrollable chip row */}
        <div className="flex md:hidden items-center gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100"
          style={{ scrollbarWidth: "none" }}>
          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap shrink-0">Paths:</span>
          {paths.map((p) => {
            const isAct = active?._id === p._id;
            return (
              <button key={p._id}
                onClick={() => { setSelected(p); setOpenMod(null); }}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0"
                style={isAct
                  ? { background: "#EC4899", color: "#fff", boxShadow: "0 2px 8px #EC489940" }
                  : { background: "#FDF2F8", color: "#EC4899", border: "1px solid #FBCFE8" }
                }>
                {p.title}
              </button>
            );
          })}
        </div>
        {/* Desktop: vertical list */}
        <div className="hidden md:block">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Career Paths <span className="text-[#EC4899]">({paths.length})</span>
          </p>
          {enrolledCount > 0 && (
            <p className="text-[9px] text-green-600 font-semibold mb-3 px-0.5">✓ {enrolledCount} enrolled</p>
          )}
          {enrolledCount === 0 && <div className="mb-3" />}
          {paths.map((p) => {
            const prog  = progress.find((pr) => pr.career_path_id === p._id);
            const isAct = active?._id === p._id;
            return (
              <button key={p._id}
                onClick={() => { setSelected(p); setOpenMod(null); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold mb-1 transition-all ${isAct ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
                style={isAct ? { background: "#EC4899" } : {}}>
                {p.title}
                {prog?.progress != null && (
                  <div className={`mt-1.5 h-1 rounded-full overflow-hidden ${isAct ? "bg-white/30" : "bg-gray-200"}`}>
                    <div className={`h-full rounded-full ${isAct ? "bg-white" : "bg-[#EC4899]"}`} style={{ width: `${Math.min(100, prog.progress)}%` }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {active && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-2xl">
          {/* Header */}
          <div className="border border-[#3D65F4]/30 rounded-xl p-4 mb-5 bg-[#F9FBFF]">
            <h2 className="text-base font-extrabold text-[#182B68] mb-1">{active.title}</h2>
            {active.description && (
              <p className="text-xs text-gray-500 leading-relaxed">{active.description}</p>
            )}
          </div>

          {/* Full description */}
          {active.careerpath_description && (
            <div className="mb-5 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold text-[#3D65F4] mb-2">About this Path</p>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{active.careerpath_description}</p>
            </div>
          )}

          {/* Prerequisites */}
          {active.prerequisites && active.prerequisites.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 mb-2 px-1">Prerequisites</p>
              <div className="flex flex-wrap gap-2">
                {active.prerequisites.map((pre) => (
                  <span key={pre} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                    {pre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          {active.modules && active.modules.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#3D65F4] mb-2 px-1">
                Learning Modules ({active.modules.length})
              </p>
              <div className="space-y-1.5 border-l-2 border-[#3D65F4]/20 pl-4">
                {active.modules.map((mod, i) => (
                  <div key={mod.module_id}>
                    <button
                      onClick={() => setOpenMod(openMod === mod.module_id ? null : mod.module_id)}
                      className="w-full text-left px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#3D65F4]/50 hover:bg-[#F9FBFF] transition-all flex justify-between items-center bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#3D65F4] text-[9px] font-extrabold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {mod.title}
                      </div>
                      {openMod === mod.module_id
                        ? <ChevronUp size={12} className="text-[#3D65F4]" />
                        : <ChevronDown size={12} className="text-gray-400" />}
                    </button>
                    {openMod === mod.module_id && (
                      <div className="ml-3 mt-1 p-3 bg-[#F9FBFF] border border-gray-100 rounded-lg">
                        <p className="text-[10px] text-gray-400">
                          Click <span className="font-semibold text-[#3D65F4]">Start Learning</span> to access topics for this module.
                        </p>
                        <button className="mt-2 px-3 py-1.5 rounded-lg bg-[#3D65F4] text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#2D55E4] transition-colors">
                          <ExternalLink size={10} /> Open in Rubrix
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Skill paths – live ────────────────────────────────────────────────────────
function SkillPathsView() {
  const { data, loading } = useRubrixData<ApiSkillPath[]>("python", "/skill/skills/", true, { requireAuth: false });
  const skills: ApiSkillPath[] = Array.isArray(data) ? data.filter((s) => s.is_active !== false) : [];
  const [search, setSearch]   = useState("");
  const filtered = skills.filter((s) => s.skill_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-[#182B68]">Skill Paths</h2>
          {skills.length > 0 && <p className="text-[11px] text-gray-400">{skills.length} skills available live</p>}
        </div>
        {loading && <Loader2 size={16} className="animate-spin text-[#3D65F4]" />}
        {!loading && (
          <input className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#3D65F4] w-40"
            placeholder="Search skills…" value={search} onChange={(e) => setSearch(e.target.value)} />
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 gap-2 text-gray-400 text-sm">
          <Loader2 size={18} className="animate-spin text-[#3D65F4]" /> Loading skills…
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((skill, i) => (
          <div key={skill._id || i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#3D65F4] hover:shadow-md transition-all cursor-pointer group">
            <h3 className="text-sm font-bold text-[#182B68] mb-2 group-hover:text-[#3D65F4] transition-colors">{skill.skill_name}</h3>
            {skill.description && (
              <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{skill.description}</p>
            )}
            {skill.prerequisites && skill.prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {skill.prerequisites.slice(0, 2).map((pre) => (
                  <span key={pre} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200">{pre}</span>
                ))}
                {skill.prerequisites.length > 2 && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">+{skill.prerequisites.length - 2}</span>
                )}
              </div>
            )}
            <button className="w-full py-2 rounded-lg bg-[#EEF2FF] text-[#3D65F4] text-xs font-semibold hover:bg-[#3D65F4] hover:text-white transition-colors flex items-center justify-center gap-1">
              <CheckCircle size={11} /> Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Company paths ─────────────────────────────────────────────────────────────
function CompanyPathsView() {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-2 gap-4">
        {companyPaths.map((company) => (
          <div key={company.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#3D65F4] hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-[#182B68]">{company.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffBadge[company.difficulty] || "bg-gray-100 text-gray-600"}`}>{company.difficulty}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {company.roles.map((role) => (
                <span key={role} className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{role}</span>
              ))}
            </div>
            <button className="mt-3 w-full py-2 rounded-lg bg-[#EEF2FF] text-[#3D65F4] text-xs font-semibold hover:bg-[#3D65F4] hover:text-white transition-colors flex items-center justify-center gap-1">
              <ExternalLink size={11} /> Prepare Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function CareerPage() {
  const [tab, setTab] = useState<"career" | "skill" | "company">("career");
  const tabs = [
    { id: "career",  label: "Career Paths" },
    { id: "skill",   label: "Skill Paths" },
    { id: "company", label: "Company Paths" },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 flex gap-6 shrink-0">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${tab === t.id ? "border-[#3D65F4] text-[#3D65F4]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "career"  && <CareerPathView />}
        {tab === "skill"   && <SkillPathsView />}
        {tab === "company" && <CompanyPathsView />}
      </div>
    </div>
  );
}
