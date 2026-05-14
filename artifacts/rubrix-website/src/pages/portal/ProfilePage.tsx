import { useState, useEffect } from "react";
import { Edit2, MapPin, Phone, Mail, Globe, Award, Loader2, LogOut, Link2, CheckCircle2, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRubrixData } from "../../hooks/useRubrixData";
import { useLocation } from "wouter";
import { updatePlatformUsernames } from "../../store/facultyDataStore";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-400 mb-1 font-medium">{label}</label>
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 bg-white hover:border-[#3D65F4]/40 transition-colors">
        <span className="text-sm font-semibold text-[#182B68]">{value || "—"}</span>
        <Edit2 size={13} className="text-gray-300 cursor-pointer hover:text-[#3D65F4] transition-colors shrink-0 ml-2" />
      </div>
    </div>
  );
}

interface RubrixProfile {
  firstName?: string; lastName?: string; mobileNo?: string;
  personalMail?: string; workMail?: string; designation?: string;
  batchName?: string; section?: string; currentYear?: string;
  currentSem?: string; cgpa?: string; fatherName?: string; dob?: string;
  instituteName?: string; departmentName?: string;
}

const LS_LC = "dn_leetcode_user";
const LS_HR = "dn_hackerrank_user";

export default function ProfilePage() {
  const [tab, setTab] = useState<"profile" | "connect" | "feedback">("profile");
  const { student, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => { logout(); navigate("/student/login"); };

  const idNo = student?.identificationNo || (student?.rollNumber ? `SPHN_STD_${student.rollNumber}` : "");
  const { data: rawInfo, loading: infoLoading } = useRubrixData<{ result?: RubrixProfile[] }>(
    "main",
    `/my-account/info?identificationNo=${encodeURIComponent(idNo)}`,
    !!idNo,
  );
  const info: RubrixProfile = rawInfo?.result?.[0] || {};

  const firstName = info.firstName || student?.firstName || "";
  const lastName  = info.lastName  || student?.lastName  || "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ") || student?.rollNumber || "";
  const email     = info.personalMail  || info.workMail  || student?.email    || "";
  const mobile    = info.mobileNo      || student?.mobile   || "";
  const college   = info.instituteName || student?.college  || "";
  const branch    = info.departmentName|| student?.branch   || "";
  const batch     = info.batchName     || student?.batch    || "";
  const section   = info.section       || student?.section  || "";
  const year      = info.currentYear   || student?.year     || "";
  const semester  = info.currentSem    || student?.semester || "";
  const cgpa      = info.cgpa          || student?.cgpa     || "";
  const roll      = student?.rollNumber || "";

  // ── Connect Accounts state ──
  const [lcUser,   setLcUser]   = useState(() => localStorage.getItem(LS_LC) || "");
  const [hrUser,   setHrUser]   = useState(() => localStorage.getItem(LS_HR) || "");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    setLcUser(localStorage.getItem(LS_LC) || "");
    setHrUser(localStorage.getItem(LS_HR) || "");
  }, [tab]);

  const handleSaveAccounts = async () => {
    setSaving(true);
    localStorage.setItem(LS_LC, lcUser.trim());
    localStorage.setItem(LS_HR, hrUser.trim());
    if (roll) {
      try { await updatePlatformUsernames(roll, lcUser.trim(), hrUser.trim()); }
      catch { /* non-fatal */ }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F9FBFF]">
      {/* Tabs */}
      <div className="px-4 md:px-6 pt-4 pb-0 bg-white border-b border-gray-100 flex gap-5">
        {[
          { id: "profile",  label: "My Profile" },
          { id: "connect",  label: "Connect Accounts" },
          { id: "feedback", label: "Feedback" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${tab === t.id ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === "profile" && (
        <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
          {infoLoading && (
            <div className="flex items-center gap-2 text-xs text-blue-500 font-semibold px-1">
              <Loader2 size={13} className="animate-spin" /> Syncing live profile data…
            </div>
          )}

          <div className="rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg"
            style={{ background: "linear-gradient(135deg,#3B82F6 0%,#EC4899 100%)" }}>
            <div>
              <p className="text-white/70 text-xs font-semibold mb-0.5">Roll Number</p>
              <span className="text-white font-extrabold text-lg md:text-xl tracking-wide">{roll}</span>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-semibold mb-0.5">Institution</p>
              <span className="text-white font-bold text-xs md:text-sm">{college || "Sphoorthy Engineering College"}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#FDF2F8] flex items-center justify-center shrink-0 border-2 border-blue-100">
              <svg viewBox="0 0 80 80" className="w-11 h-11 md:w-14 md:h-14" fill="none">
                <circle cx="40" cy="28" r="15" fill="#BFDBFE"/>
                <ellipse cx="40" cy="66" rx="25" ry="13" fill="#BFDBFE"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-extrabold text-blue-600 truncate">{fullName}</h2>
              <p className="text-xs text-gray-400 mb-2">{roll}</p>
              <div className="flex flex-wrap gap-1.5">
                {year && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{year}</span>}
                {semester && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">SEM {semester}</span>}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-500">Data Science</span>
                {cgpa && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">CGPA: {cgpa}</span>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#182B68]">College Information</h3>
              <div className="flex items-center gap-1.5">
                <Award size={13} className="text-orange-500" />
                <span className="text-xs font-bold text-orange-600">NAAC A Grade</span>
                <span className="mx-1 text-gray-300">|</span>
                <span className="text-xs font-bold text-[#3D65F4]">UGC Autonomous</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0 mt-0.5"><MapPin size={13} className="text-[#3D65F4]" /></div>
                <div>
                  <p className="text-xs font-semibold text-[#182B68]">{college || "Sphoorthy Engineering College (UGC Autonomous)"}</p>
                  <p className="text-xs text-gray-500">Nadargul Village, Saroornagar Mandal, Hyderabad, Telangana – 501510</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0"><Phone size={13} className="text-[#3D65F4]" /></div>
                <p className="text-xs text-gray-600">+91 9392 11 9392</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0"><Mail size={13} className="text-[#3D65F4]" /></div>
                <p className="text-xs text-gray-600">admissions@sphoorthyengg.ac.in</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0"><Globe size={13} className="text-[#3D65F4]" /></div>
                <a href="https://www.sphoorthyengg.ac.in" target="_blank" rel="noopener noreferrer" className="text-xs text-[#3D65F4] font-semibold hover:underline">www.sphoorthyengg.ac.in</a>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                {[{ label: "Affiliation", value: "JNTUH" }, { label: "Code", value: "SPHN" }, { label: "Est.", value: "2004" }].map((item) => (
                  <div key={item.label} className="bg-[#F9FBFF] rounded-xl p-2.5 text-center border border-blue-50">
                    <p className="text-sm font-extrabold text-[#3D65F4]">{item.value}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#182B68] mb-4">My General Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="First Name"    value={firstName} />
              <InfoField label="Last Name"     value={lastName} />
              <InfoField label="Mobile"        value={mobile} />
              <InfoField label="Email"         value={email} />
              <InfoField label="Batch"         value={batch} />
              <InfoField label="Roll Number"   value={roll} />
              <div className="col-span-2">
                <InfoField label="Branch" value={branch || "B.Tech – Computer Science & Engineering (Data Science)"} />
              </div>
              <InfoField label="Section"       value={section} />
              <InfoField label="Current Year"  value={year} />
              <InfoField label="Semester"      value={semester ? `SEM ${semester}` : ""} />
              <InfoField label="CGPA"          value={cgpa} />
              <InfoField label="Father's Name" value={info.fatherName || ""} />
              <InfoField label="Date of Birth" value={info.dob || ""} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#182B68] mb-4">Academic Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "CGPA",     value: cgpa || "—",      color: "text-blue-600" },
                { label: "Year",     value: year || "2nd",    color: "text-pink-500" },
                { label: "Semester", value: semester || "IV", color: "text-amber-500" },
                { label: "Section",  value: section || "A",   color: "text-emerald-600" },
              ].map((s) => (
                <div key={s.label} className="bg-[#F9FBFF] rounded-xl p-3 text-center border border-blue-50">
                  <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pb-1">
            <p className="text-[11px] text-gray-300 font-medium">
              Portal customized by <span className="text-[#3D65F4] font-bold">Neanavth Jashwanth Singh</span> · 24N81A6758 · Sphoorthy Engineering College
            </p>
          </div>

          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg,#FEF2F2,#FFF1F2)", border: "1.5px solid #FCA5A5", color: "#DC2626", boxShadow: "0 4px 16px rgba(220,38,38,0.10)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#FEE2E2,#FFE4E6)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg,#FEF2F2,#FFF1F2)"; }}>
            <LogOut size={16} strokeWidth={2.5} /> Sign Out
          </button>
        </div>
      )}

      {/* ── CONNECT ACCOUNTS TAB ── */}
      {tab === "connect" && (
        <div className="max-w-lg mx-auto p-4 md:p-6 space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Link2 size={16} className="text-blue-500" />
              <h3 className="text-sm font-extrabold text-[#182B68]">Connect Coding Platforms</h3>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Link your LeetCode and HackerRank accounts to track your progress, view stats in the Practice section, and appear on the leaderboard.
            </p>
          </div>

          {/* LeetCode */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFA116" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">LeetCode</p>
                <p className="text-[10px] text-gray-400">Track solved problems, ranking & streaks</p>
              </div>
              {lcUser && (
                <a href={`https://leetcode.com/${lcUser}`} target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:underline">
                  <ExternalLink size={10} /> View
                </a>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                value={lcUser}
                onChange={e => setLcUser(e.target.value)}
                placeholder="e.g. jashwanth_coder"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-mono placeholder:text-gray-300 focus:outline-none focus:border-orange-400 transition-colors"
              />
              {lcUser && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Profile: <span className="text-orange-500 font-semibold">leetcode.com/{lcUser}</span>
                </p>
              )}
            </div>
          </div>

          {/* HackerRank */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#2EC866" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                  <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.117-.258-.26-.258-.143 0-.258.115-.258.258v9.886c0 .143.115.258.258.258.143 0 .26-.115.26-.258v-4.255h4.074v4.255c0 .143.117.258.258.258.143 0 .258-.115.258-.258V7.057c0-.143-.115-.258-.258-.258z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">HackerRank</p>
                <p className="text-[10px] text-gray-400">Showcase badges, stars & certifications</p>
              </div>
              {hrUser && (
                <a href={`https://www.hackerrank.com/profile/${hrUser}`} target="_blank" rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 text-[10px] font-bold text-green-600 hover:underline">
                  <ExternalLink size={10} /> View
                </a>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
              <input
                value={hrUser}
                onChange={e => setHrUser(e.target.value)}
                placeholder="e.g. jashwanth_singh"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-mono placeholder:text-gray-300 focus:outline-none focus:border-green-400 transition-colors"
              />
              {hrUser && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Profile: <span className="text-green-600 font-semibold">hackerrank.com/profile/{hrUser}</span>
                </p>
              )}
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 border border-green-200">
              <CheckCircle2 size={15} className="text-green-500 shrink-0" />
              <p className="text-xs font-bold text-green-700">Accounts linked successfully!</p>
            </div>
          )}

          <button onClick={handleSaveAccounts} disabled={saving}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            style={{ background: "linear-gradient(135deg,#3D65F4,#2B4ED8)", boxShadow: "0 8px 24px rgba(61,101,244,0.3)" }}>
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
              : <><Link2 size={14} /> Save Connected Accounts</>}
          </button>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-[11px] text-blue-700 font-semibold mb-1">How it works</p>
            <ul className="text-[11px] text-blue-600 space-y-1 list-disc list-inside">
              <li>Your LeetCode public stats (ranking, solved count) appear on the Practice page</li>
              <li>Faculty can view your coding progress in the admin panel</li>
              <li>Your LeetCode stats contribute to the class leaderboard</li>
              <li>Only public profile data is accessed — no password required</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── FEEDBACK TAB ── */}
      {tab === "feedback" && (
        <div className="max-w-lg mx-auto p-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#182B68] mb-1">Complaints & Feedback</h3>
            <p className="text-xs text-gray-400 mb-5">Your feedback helps improve the platform for everyone.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Category</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#3D65F4] bg-white">
                  <option>Academic Issue</option><option>Technical Problem</option><option>Career Guidance</option><option>General Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Subject</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D65F4] transition-colors" placeholder="Brief subject of your complaint or feedback" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Message</label>
                <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D65F4] h-32 resize-none transition-colors" placeholder="Describe in detail…" />
              </div>
              <button className="w-full py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #3B82F6, #EC4899)" }}>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
