import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { projects, projectCategories, type Project, type Difficulty } from "../../data/practice";

const diffBadge: Record<Difficulty, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-orange-100 text-orange-700",
  Expert: "bg-red-100 text-red-700",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3D65F4] hover:shadow-md transition-all cursor-pointer flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffBadge[project.difficulty]}`}>
          {project.difficulty}
        </span>
      </div>
      <h3 className="text-sm font-bold text-[#182B68] mb-1 leading-tight">{project.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function ResourcePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [catOffset, setCatOffset] = useState(0);
  const visibleCats = projectCategories.slice(catOffset, catOffset + 6);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto">
      {/* Top tab */}
      <div className="mb-4">
        <p className="text-sm font-bold text-[#3D65F4] border-b-2 border-[#3D65F4] inline-block pb-1">Projects</p>
      </div>

      <h2 className="text-xl font-extrabold text-[#3D65F4] mb-4">Search for projects</h2>

      {/* Search */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 mb-3 focus-within:border-[#3D65F4]">
        <Search size={16} className="text-gray-400" />
        <input
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300"
          placeholder="Search for what you want to learn"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1 border-l pl-3 border-gray-200">
          <span className="text-xs font-semibold text-gray-500">All Difficulty</span>
          <span className="text-gray-400">▾</span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setCatOffset(Math.max(0, catOffset - 1))} className="p-1 rounded border border-gray-200 hover:border-[#3D65F4]">
          <ChevronLeft size={14} />
        </button>
        <div className="flex gap-1.5 flex-1 overflow-hidden">
          {visibleCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat ? "bg-[#3D65F4] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setCatOffset(Math.min(projectCategories.length - 6, catOffset + 1))} className="p-1 rounded border border-gray-200 hover:border-[#3D65F4]">
          <ChevronRight size={14} />
        </button>
        <button className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200">
          Select Tags
        </button>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
