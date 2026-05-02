import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Tag, BarChart2, Folder } from "lucide-react";
import { projects, projectCategories, type Project, type Difficulty } from "../../data/practice";

const DIFF_STYLE: Record<Difficulty, { bg: string; text: string; bar: string }> = {
  Beginner:     { bg: "#DCFCE7", text: "#16A34A", bar: "#22C55E" },
  Intermediate: { bg: "#DBEAFE", text: "#1D4ED8", bar: "#3B82F6" },
  Advanced:     { bg: "#FEF3C7", text: "#D97706", bar: "#F59E0B" },
  Expert:       { bg: "#FFE4E6", text: "#E11D48", bar: "#F43F5E" },
};

const CARD_COLORS = [
  "linear-gradient(135deg,#3B82F6,#06B6D4)",
  "linear-gradient(135deg,#0EA5E9,#10B981)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#EC4899,#F43F5E)",
  "linear-gradient(135deg,#3B82F6,#60A5FA)",
];

const DIFF_LEVEL: Record<Difficulty, number> = {
  Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100,
};

// ── Project Detail (full-screen overlay) ──────────────────────────────────────
function ProjectDetail({ project, idx, onBack }: { project: Project; idx: number; onBack: () => void }) {
  const diff  = DIFF_STYLE[project.difficulty] || { bg: "#F3F4F6", text: "#6B7280", bar: "#9CA3AF" };
  const grad  = CARD_COLORS[idx % CARD_COLORS.length];
  const level = DIFF_LEVEL[project.difficulty] || 50;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-blue-500 text-sm font-semibold hover:gap-2.5 transition-all"
        >
          <ArrowLeft size={16} /> Back to Resources
        </button>
        <span
          className="text-[10px] font-extrabold px-3 py-1 rounded-full"
          style={{ background: diff.bg, color: diff.text }}
        >
          {project.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero banner */}
        <div className="h-2 w-full" style={{ background: grad }} />
        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* Category chip */}
          <div className="flex items-center gap-2 mb-3">
            <Folder size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{project.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-slate-800 mb-3 leading-tight">{project.title}</h1>

          {/* Difficulty bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><BarChart2 size={11} /> Complexity</span>
              <span className="text-[10px] font-bold" style={{ color: diff.text }}>{project.difficulty}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${level}%`, background: diff.bar }} />
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-5 border border-slate-100">
            <p className="text-sm font-bold text-slate-700 mb-2">Project Overview</p>
            <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <Tag size={10} /> Skills & Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border"
                    style={{ background: "#EFF6FF", color: "#2563EB", borderColor: "#BFDBFE" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What you'll build section */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 mb-6">
            <p className="text-sm font-bold text-emerald-700 mb-3">What you'll build</p>
            <ul className="space-y-2">
              {["Design and implement the core architecture", "Write clean, well-structured code", "Test with real-world scenarios", "Document your solution"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[8px] font-extrabold text-emerald-600">{i + 1}</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            style={{ background: grad }}
          >
            <ExternalLink size={15} /> Start Project on Rubrix
          </button>

          <p className="text-center text-[10px] text-slate-300 mt-4">
            Project resources powered by <span className="text-blue-400 font-bold">DataNauts · Big Brains</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, idx, onSelect }: { project: Project; idx: number; onSelect: () => void }) {
  const diff = DIFF_STYLE[project.difficulty] || { bg: "#F3F4F6", text: "#6B7280", bar: "#9CA3AF" };
  const grad = CARD_COLORS[idx % CARD_COLORS.length];
  return (
    <button
      onClick={onSelect}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-left flex flex-col w-full"
    >
      <div className="h-2 w-full" style={{ background: grad }} />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg" style={{ background: diff.bg, color: diff.text }}>
            {project.difficulty}
          </span>
          <ExternalLink size={13} className="text-slate-300" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-800 mb-1.5 leading-snug">{project.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 flex-1 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100">{tag}</span>
          ))}
          {project.tags.length > 2 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">+{project.tags.length - 2}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResourcePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [catOffset, setCatOffset] = useState(0);
  const [selectedProject, setSelectedProject] = useState<{ project: Project; idx: number } | null>(null);
  const VISIBLE = 6;
  const visibleCats = projectCategories.slice(catOffset, catOffset + VISIBLE);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject.project}
        idx={selectedProject.idx}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F4F6FB" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-4 md:py-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Project Resources</h1>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} projects available to practice</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "#ECFDF5", border: "1px solid #D1FAE5" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">{projects.length} Projects</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-300 focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            className="flex-1 text-sm outline-none bg-transparent text-slate-700 placeholder-slate-400"
            placeholder="Search projects by name or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600 font-medium">Clear</button>
          )}
        </div>

        {/* Category chips */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setCatOffset(Math.max(0, catOffset - 1))}
            disabled={catOffset === 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 disabled:opacity-30 transition-all shrink-0"
          >
            <ChevronLeft size={13} />
          </button>
          <div className="flex gap-1.5 flex-1 overflow-hidden">
            {visibleCats.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150"
                style={selectedCategory === cat
                  ? { background: "linear-gradient(135deg,#3B82F6,#06B6D4)", color: "#fff", boxShadow: "0 2px 8px #3B82F640" }
                  : { background: "#F1F5F9", color: "#64748B" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCatOffset(Math.min(projectCategories.length - VISIBLE, catOffset + 1))}
            disabled={catOffset + VISIBLE >= projectCategories.length}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 disabled:opacity-30 transition-all shrink-0"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 md:p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-2xl">🔍</div>
            <p className="font-semibold text-sm">No projects found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                idx={i}
                onSelect={() => setSelectedProject({ project, idx: i })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
